import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  extend type Query {
    operationTraces: [OperationTrace!]
  }

  type OperationTrace {
    id: ID!
    operation: Operation!
    startTime: Long!
    duration: Long!
    parsing: Long
    validation: Long
    execution: Long
    fieldTraces: [FieldTrace!]
    errors: [TraceError!]
  }

  type FieldTrace {
    id: ID!
    path: String!
    field: Field!
    startTime: Long!
    endTime: Long!
    duration: Long!
    errors: [TraceError!]
  }

  type TraceError {
    message: String!
    locations: [TraceErrorLocation!]
    json: String
  }

  type TraceErrorLocation {
    line: Int!
    column: Int!
  }

  extend type Field {
    traces: [FieldTrace!]
  }

  extend type Operation {
    traces: [OperationTrace!]
  }
`;

export const resolvers: Resolvers = {
  Query: {
    operationTraces(_, _args, context) {
      return context.inspectorAdapter.readOperationTraces();
    },
  },
  OperationTrace: {
    operation(trace, _args, context) {
      return context.inspectorAdapter.readOperationById(trace.operationId);
    },
    fieldTraces(trace, _args, context) {
      return context.inspectorAdapter.readFieldTracesByOperationTraceId(
        trace.id,
      );
    },
    errors(trace, _args, context) {
      return context.inspectorAdapter.readErrorsByOperationTraceId(trace.id);
    },
  },
  FieldTrace: {
    duration(trace) {
      return trace.endTime - trace.startTime;
    },
    field(trace, _args, context) {
      return context.inspectorAdapter.readFieldById(trace.fieldId);
    },
    errors(trace, _args, context) {
      return context.inspectorAdapter.readErrorsByFieldTraceId(trace.id);
    },
  },
  Operation: {
    traces(operation, _args, context) {
      return context.inspectorAdapter.readOperationTracesByOperationId(
        operation.id,
      );
    },
  },
  Field: {
    traces(field, _args, context) {
      return context.inspectorAdapter.readFieldTracesByFieldId(field.id);
    },
  },
};
