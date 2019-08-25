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
    await createTable(client);
  }
}

function createOperationsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.Operations, t => {
    t.increments('id').primary();
    t.text('name');
    t.text('operation');
    t.text('signature').unique();
  });
}

function createFieldsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.Fields, t => {
    t.increments('id').primary();
    t.string('name');
    t.string('type');
  });
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

function createErrorsTable(client: knex) {
  return client.schema.createTableIfNotExists(Tables.Errors, t => {
    t.increments('id').primary();
    t.string('message');
    t.text('json');
    t.integer('fieldTraceId')
      .references('id')
      .inTable(Tables.FieldTraces);
    t.integer('operationTraceId')
      .references('id')
      .inTable(Tables.OperationTraces);
  });
}
