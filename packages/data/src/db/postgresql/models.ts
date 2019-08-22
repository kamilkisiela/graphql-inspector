import knex from 'knex';

export const Tables = {
  Operations: 'operations',
  Fields: 'fields',
  OperationsFields: 'operations_fields',
  OperationTraces: 'operation_traces',
  FieldTraces: 'field_traces',
  Errors: 'errors',
};

export async function createTables(client: knex) {
  if (await client.schema.hasTable(Tables.Operations)) {
    return;
  }

  const tables = [
    createOperationsTable,
    createFieldsTable,
    createOperationsFieldsTable,
    createOperationTracesTable,
    createFieldTracesTable,
    createErrorsTable,
  ];

  for (const createTable of tables) {
    console.log('creating tables');
    await createTable(client);
  }
}

export interface OperationModel {
  id: number;
  name: string;
  operation: string;
  signature: string;
}

function createOperationsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.Operations, t => {
    t.increments('id').primary();
    t.text('name');
    t.text('operation');
    t.text('signature').unique();
  });
}

export interface FieldModel {
  id: number;
  name: string;
  type: string;
}

function createFieldsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.Fields, t => {
    t.increments('id').primary();
    t.string('name');
    t.string('type');
  });
}

export interface OperationFieldModel {
  operationId: number;
  fieldId: number;
}

function createOperationsFieldsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.OperationsFields, t => {
    t.integer('operationId')
      .references('id')
      .inTable(Tables.Operations);
    t.integer('fieldId')
      .references('id')
      .inTable(Tables.Fields);
  });
}

export interface OperationTraceModel {
  id: number;
  operationId: number;
  startTime: number;
  duration: number;
  parsing: number;
  validation: number;
  execution: number;
}

function createOperationTracesTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.OperationTraces, t => {
    t.increments('id').primary();
    t.integer('operationId')
      .references('id')
      .inTable(Tables.Operations);
    t.bigInteger('startTime');
    // metrics
    t.bigInteger('duration');
    t.bigInteger('parsing');
    t.bigInteger('validation');
    t.bigInteger('execution');
  });
}

export interface FieldTraceModel {
  id: number;
  path: string;
  fieldId: number;
  operationTraceId: number;
  startTime: number;
  endTime: number;
}

function createFieldTracesTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.FieldTraces, t => {
    t.increments('id').primary();
    t.string('path');
    t.integer('fieldId')
      .references('id')
      .inTable(Tables.Fields);
    t.integer('operationTraceId')
      .references('id')
      .inTable(Tables.OperationTraces);
    // metrics
    t.bigInteger('startTime');
    t.bigInteger('endTime');
  });
}

export interface ErrorModel {
  id: number;
  message: string;
  json: string;
  fieldTraceId?: number;
  operationTraceId?: number;
}

function createErrorsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.Errors, t => {
    t.increments('id').primary();
    t.string('message');
    t.json('json');
    t.integer('fieldTraceId')
      .references('id')
      .inTable(Tables.FieldTraces);
    t.integer('operationTraceId')
      .references('id')
      .inTable(Tables.OperationTraces);
  });
}
