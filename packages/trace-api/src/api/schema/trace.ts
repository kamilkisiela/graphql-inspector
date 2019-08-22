import {Resolvers} from '../generated/graphql';

export const typeDefs = /* GraphQL */ `
  extend type Query {
    operationTraces: [OperationTrace]
  }

  type OperationTrace {
    id: ID!
    operation: Operation!
    startTime: Long!
    duration: Long!
    parsing: Long
    validation: Long
    execution: Long
    fieldTraces: [FieldTrace]
  }

  type FieldTrace {
    id: ID!
    path: String!
    field: Field!
    startTime: Long!
    endTime: Long!
    duration: Long!
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
  },
  FieldTrace: {
    duration(trace) {
      return trace.endTime - trace.startTime;
    },
    field(trace, _args, context) {
      return context.inspectorAdapter.readFieldById(trace.fieldId);
    },
  },
};
