import * as knex from 'knex';

import {
  OperationModel,
  FieldModel,
  OperationFieldModel,
  OperationTraceModel,
  FieldTraceModel,
  ErrorModel,
  FieldUsageModel,
  OperationFilter,
  Adapter,
  AdapterConfig,
  translatePeriod,
} from '@graphql-inspector/trace-api';

import {
  Report,
  Trace,
  operationSignature,
  normalizeTraceNode,
  NormalizedTraceNodeMap,
} from '@graphql-inspector/trace';

import {Tables, createTables} from './tables';
import {flatten} from './helpers';

interface Logger {
  log(msg: string): void;
  debug(msg: string): void;
}

export interface PostgreSQLAdapterConfig extends AdapterConfig {
  connection: knex.ConnectionConfig | string;
  logger?: Logger;
}

export class PostgreSQLAdapter implements Adapter {
  private client!: knex;
  private config: PostgreSQLAdapterConfig;

  constructor(config: PostgreSQLAdapterConfig) {
    this.config = {
      debug: false,
      logger: {
        log(msg) {
          console.log(msg);
        },
        debug(msg) {
          console.debug(msg);
        },
      },
      ...config,
    };

    this.client = knex({client: 'pg', connection: this.config.connection});
  }

  async createTables() {
    return createTables(this.client);
  }

  async writeReport(report: Report): Promise<void> {
    this.debug('Writing report');
    // 1. Insert operation
    //  1.1. Check if exists in Tables.Operations
    //  1.2. Insert if not, otherwise get the ID
    //
    // 2. Iterate through fields
    //  2.1. Flatten them and add a path
    //  2.2. If operation exists, fields are there, otherwise insert them
    //
    // 3. Insert traces for an operation
    //
    // 4. Insert each field trace
    //
    // 5. Insert errors for an operation and fields at the same time
    await Promise.all(report.traces.map(trace => this.writeTrace(trace)));
  }

  async readFields(): Promise<FieldModel[]> {
    return this.client<FieldModel>(Tables.Fields).select('*');
  }

  async readFieldsByOperationId(operationId: number): Promise<FieldModel[]> {
    return this.client<FieldModel>(Tables.Fields)
      .select(`${Tables.Fields}.*`)
      .innerJoin(
        Tables.OperationsFields,
        `${Tables.OperationsFields}.fieldId`,
        `${Tables.Fields}.id`,
      )
      .where(`${Tables.OperationsFields}.operationId`, '=', operationId);
  }

  async readFieldById(fieldId: number): Promise<FieldModel> {
    const [field] = await this.client<FieldModel>(Tables.Fields)
      .select('*')
      .where({id: fieldId});

    return field;
  }

  async readOperations(filter?: OperationFilter): Promise<OperationModel[]> {
    const query = this.client<OperationModel>(Tables.Operations)
      .select(`${Tables.Operations}.*`)
      .leftJoin(
        Tables.OperationsFields,
        `${Tables.OperationsFields}.operationId`,
        `${Tables.Operations}.id`,
      )
      .leftJoin(
        Tables.Fields,
        `${Tables.Fields}.id`,
        `${Tables.OperationsFields}.fieldId`,
      )
      .groupBy(`${Tables.Operations}.id`);

    if (filter) {
      if (filter.limit) {
        query.limit(filter.limit);
      }

      if (filter.where && filter.where.operationName) {
        query.andWhere(
          `${Tables.Operations}.name`,
          '=',
          filter.where.operationName,
        );
      }

      if (filter.where && filter.where.hasField) {
        query
          .andWhere(`${Tables.Fields}.name`, '=', filter.where.hasField!.name)
          .andWhere(`${Tables.Fields}.type`, '=', filter.where.hasField!.type);
      }
    }

    return query;
  }

  async readOperationById(operationId: number): Promise<OperationModel> {
    const [result] = await this.client<OperationModel>(Tables.Operations)
      .select('*')
      .where({id: operationId})
      .limit(1);

    return result;
  }

  async readOperationTraces(): Promise<OperationTraceModel[]> {
    return this.client<OperationTraceModel>(Tables.OperationTraces).select('*');
  }

  async readOperationTracesByOperationId(
    operationId: number,
  ): Promise<OperationTraceModel[]> {
    return this.client<OperationTraceModel>(Tables.OperationTraces)
      .select('*')
      .where({operationId});
  }

  async readFieldTraces(): Promise<FieldTraceModel[]> {
    return this.client<FieldTraceModel>(Tables.FieldTraces).select('*');
  }

  async readFieldTracesByFieldId(fieldId: number): Promise<FieldTraceModel[]> {
    return this.client<FieldTraceModel>(Tables.FieldTraces)
      .select('*')
      .where({fieldId});
  }

  async readFieldTracesByOperationTraceId(
    operationTraceId: number,
  ): Promise<FieldTraceModel[]> {
    return this.client<FieldTraceModel>(Tables.FieldTraces)
      .select('*')
      .where({operationTraceId});
  }

  async readErrors(): Promise<ErrorModel[]> {
    return this.client<ErrorModel>(Tables.Errors).select('*');
  }

  readErrorsByFieldTraceId(fieldTraceId: number): Promise<ErrorModel[]> {
    return this.client<ErrorModel>(Tables.Errors)
      .select('*')
      .where({
        fieldTraceId,
      });
  }

  readErrorsByOperationTraceId(
    operationTraceId: number,
  ): Promise<ErrorModel[]> {
    return this.client<ErrorModel>(Tables.Errors)
      .select('*')
      .where({
        operationTraceId,
      });
  }

  async readFieldUsage({
    type,
    field,
    period,
  }: {
    type: string;
    field: string;
    period?: string;
  }): Promise<FieldUsageModel> {
    // Get a list of all operations
    // and the total number of runs
    // grouped by operation
    // where field and type both match
    const queryWithField = this.client<OperationTraceModel>(
      Tables.OperationTraces,
    )
      .select(
        `${Tables.OperationTraces}.operationId`,
        `${Tables.Operations}.operation`,
        this.client.count(`${Tables.OperationTraces}.id`).as('total'),
      )
      .innerJoin(
        Tables.OperationsFields,
        `${Tables.OperationsFields}.operationId`,
        `${Tables.OperationTraces}.operationId`,
      )
      .innerJoin(
        Tables.Fields,
        `${Tables.Fields}.id`,
        `${Tables.OperationsFields}.fieldId`,
      )
      .innerJoin(
        Tables.Operations,
        `${Tables.Operations}.id`,
        `${Tables.OperationTraces}.operationId`,
      )
      .groupBy(
        `${Tables.OperationTraces}.operationId`,
        `${Tables.Operations}.operation`,
      )
      .where(`${Tables.Fields}.name`, '=', field)
      .andWhere(`${Tables.Fields}.type`, '=', type);

    const queryTotal = this.client<OperationTraceModel>(Tables.OperationTraces)
      .select(
        `${Tables.OperationTraces}.operationId`,
        this.client.count(`${Tables.OperationTraces}.id`).as('total'),
      )
      .groupBy(`${Tables.OperationTraces}.operationId`);

    if (period) {
      const startedAt = new Date().getTime() - translatePeriod(period);

      queryWithField.andWhere(
        `${Tables.OperationTraces}.startTime`,
        '>=',
        startedAt,
      );

      queryTotal.andWhere(
        `${Tables.OperationTraces}.startTime`,
        '>=',
        startedAt,
      );
    }

    const usage = await queryWithField;
    const totalUsage = await queryTotal;

    const sum: number = totalUsage.reduce(
      (acc, obj) => acc + parseInt(obj.total, 10),
      0,
    );

    const countSummary = {
      total: 0,
      min: 0,
      max: 0,
      average: 0,
    };
    const percentageSummary = {
      min: 0,
      max: 0,
    };

    const records = usage.map((obj, i) => {
      const count = parseInt(obj.total, 10);
      const percentage = Math.round(((100 * count) / sum) * 100) / 100;

      if (i === 0) {
        countSummary.min = count;
        countSummary.max = count;
        percentageSummary.min = percentage;
        percentageSummary.max = percentage;
      }

      countSummary.total += count;

      if (countSummary.min > count) {
        countSummary.min = count;
      }

      if (countSummary.max < count) {
        countSummary.max = count;
      }

      if (percentageSummary.min > percentage) {
        percentageSummary.min = percentage;
      }

      if (percentageSummary.max < percentage) {
        percentageSummary.max = percentage;
      }

      return {
        id: obj.operationId,
        operation: obj.operation,
        count,
        percentage,
      };
    });

    if (records.length) {
      countSummary.average = countSummary.total / records.length;
    }

    return {
      count: countSummary,
      percentage: percentageSummary,
      nodes: records,
    };
  }

  private async writeTrace(trace: Trace) {
    this.debug('Writing a trace');
    const signature = operationSignature({
      document: trace.query!,
      operationName: trace.operationName!,
    });

    this.debug(`Using signature: ${signature}`);

    // check if operation exists
    const [existingOperation] = await this.client<OperationModel>(
      Tables.Operations,
    )
      .select('id')
      .where({signature});

    let operationId: number;

    if (existingOperation) {
      this.debug('Operation already exists');
      operationId = existingOperation.id;
    } else {
      // create one if not
      this.debug('Creating a new operation');
      const [newOperationId] = await this.client<OperationModel>(
        Tables.Operations,
      )
        .insert({
          operation: trace.query,
          name: trace.operationName,
          signature,
        })
        .returning('id');

      operationId = newOperationId;
    }

    const traceNodeMap = normalizeTraceNode(trace.entry);
    const fieldIdMap = await this.ensureFieldIdMap(traceNodeMap);

    // assign fields to operation
    if (!existingOperation) {
      this.debug('Assigning fields to an operation');
      await this.client<OperationFieldModel>(Tables.OperationsFields).insert(
        Object.values(fieldIdMap).map(fieldId => {
          return {
            fieldId,
            operationId,
          };
        }),
      );
    }

    // instert operation trace
    this.debug('Inserting an operation trace');
    const [operationTraceId] = await this.client<OperationTraceModel>(
      Tables.OperationTraces,
    )
      .insert({
        operationId,
        startTime: trace.startTime,
        duration: trace.duration,
        parsing: trace.parsing,
        validation: trace.validation,
        execution: trace.execution,
      })
      .returning('id');

    const nodes = flatten(Object.values(traceNodeMap));

    // insert field traces
    this.debug('Inserting field traces');
    const fieldTraceIds = await this.client<FieldTraceModel>(Tables.FieldTraces)
      .insert(
        nodes.map(node => {
          const fieldId = fieldIdMap[`${node.parentType}.${node.field}`];

          return {
            path: node.path.join('.'),
            fieldId,
            operationTraceId,
            startTime: node.startTime,
            endTime: node.endTime,
          };
        }),
      )
      .returning('id');

    // insert errors for an operation
    this.debug('Inserting operation errors');
    if (trace.entry.errors.length) {
      await this.client<ErrorModel>(Tables.Errors).insert(
        trace.entry.errors.map(error => {
          return {
            operationTraceId,
            message: error.message,
            json: error.json,
          };
        }),
      );
    }

    // insert errors for each field
    this.debug('Inserting field errors');
    await this.client<ErrorModel>(Tables.Errors).insert(
      flatten(
        nodes
          .filter(node => node.errors.length)
          .map((node, i) => {
            const fieldTraceId = fieldTraceIds[i];

            return node.errors.map(error => {
              return {
                fieldTraceId,
                message: error.message,
                json: error.json,
              };
            });
          }),
      ),
    );
  }

  private async ensureFieldIdMap(
    traceNodeMap: NormalizedTraceNodeMap,
  ): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    const keys = Object.keys(traceNodeMap);

    for (const index of keys) {
      const [type, field] = index.split('.') as [string, string];
      let fieldId: number;

      // check if exists
      const [fieldResult] = await this.client<FieldModel>(Tables.Fields)
        .select('id')
        .where({
          type,
          name: field,
        });

      if (fieldResult) {
        fieldId = fieldResult.id;
      } else {
        // create new one
        this.debug(`Inserting a new field: ${type}.${field}`);
        const [newFieldId] = await this.client<FieldModel>(Tables.Fields)
          .insert({
            type,
            name: field,
          })
          .returning('id');

        fieldId = newFieldId;
      }

      result[index] = fieldId;
    }

    return result;
  }

  private debug(msg: string) {
    if (this.config.debug) {
      this.config.logger!.log(msg);
    }
  }
}
