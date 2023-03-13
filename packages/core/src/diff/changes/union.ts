import { GraphQLObjectType, GraphQLUnionType } from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  UnionMemberAdded,
  UnionMemberRemoved,
} from './change';

function buildUnionMemberRemovedMessage(args: UnionMemberRemoved) {
  return `Member '${args.meta.removedUnionMemberTypeName}' was removed from Union type '${args.meta.unionName}'`;
}

export function unionMemberRemoved(
  union: GraphQLUnionType,
  type: GraphQLObjectType,
): Change<ChangeType.UnionMemberRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing a union member from a union can cause existing queries that use this union member in a fragment spread to error.',
    },
    type: ChangeType.UnionMemberRemoved,
    get message() {
      return buildUnionMemberRemovedMessage(this);
    },
    path: union.name,
    meta: {
      unionName: union.name,
      removedUnionMemberTypeName: type.name,
    },
  };
}

function buildUnionMemberAddedMessage(args: UnionMemberAdded) {
  return `Member '${args.meta.addedUnionMemberTypeName}' was added to Union type '${args.meta.unionName}'`;
}

export function unionMemberAdded(
  union: GraphQLUnionType,
  type: GraphQLObjectType,
): Change<ChangeType.UnionMemberAdded> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Adding a possible type to Unions may break existing clients that were not programming defensively against a new possible type.',
    },
    type: ChangeType.UnionMemberAdded,
    get message() {
      return buildUnionMemberAddedMessage(this);
    },
    path: union.name,
    meta: {
      unionName: union.name,
      addedUnionMemberTypeName: type.name,
    },
  };
}
