import ms = require('ms');
import {Report} from '@graphql-inspector/trace';
import {
  OperationModel,
  FieldModel,
  OperationTraceModel,
  FieldTraceModel,
  FieldUsageModel,
  OperationFilter,
  ErrorModel,
} from './models';

export function translatePeriod(period: string): number {
  return ms(period);
}

export interface AdapterConfig {
  /**
   * Debug mode (default: false)
   */
  debug?: boolean;
}

export interface Adapter {
  // write
  writeReport(report: Report): Promise<void>;

  // read
  readOperations(filter?: OperationFilter): Promise<OperationModel[]>;
  readOperationById(operationId: number): Promise<OperationModel>;
  readFields(): Promise<FieldModel[]>;
  readFieldsByOperationId(operationId: number): Promise<FieldModel[]>;
  readFieldById(fieldId: number): Promise<FieldModel>;
  readOperationTraces(): Promise<OperationTraceModel[]>;
  readOperationTracesByOperationId(
    operationId: number,
  ): Promise<OperationTraceModel[]>;
  readFieldTraces(): Promise<FieldTraceModel[]>;
  readFieldTracesByFieldId(fieldId: number): Promise<FieldTraceModel[]>;
  readFieldTracesByOperationTraceId(
    operationTraceId: number,
  ): Promise<FieldTraceModel[]>;
  readErrorsByFieldTraceId(fieldTraceId: number): Promise<ErrorModel[]>;
  readErrorsByOperationTraceId(fieldTraceId: number): Promise<ErrorModel[]>;
  readFieldUsage(input: {
    field: string;
    type: string;
    period?: string;
  }): Promise<FieldUsageModel>;
}
