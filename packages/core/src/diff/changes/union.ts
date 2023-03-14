import { GraphQLObjectType, GraphQLUnionType } from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  UnionMemberAdded,
  UnionMemberRemoved,
} from './change';

function buildUnionMemberRemovedMessage(args: UnionMemberRemoved['meta']) {
  return `Member '${args.removedUnionMemberTypeName}' was removed from Union type '${args.unionName}'`;
}

export function unionMemberRemovedFromMeta(args: UnionMemberRemoved) {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing a union member from a union can cause existing queries that use this union member in a fragment spread to error.',
    },
    type: ChangeType.UnionMemberRemoved,
    message: buildUnionMemberRemovedMessage(args.meta),
    meta: args.meta,
    path: args.meta.unionName,
  } as const;
}

export function unionMemberRemoved(
  union: GraphQLUnionType,
  type: GraphQLObjectType,
): Change<ChangeType.UnionMemberRemoved> {
  return unionMemberRemovedFromMeta({
    type: ChangeType.UnionMemberRemoved,
    meta: {
      unionName: union.name,
      removedUnionMemberTypeName: type.name,
    },
  });
}

function buildUnionMemberAddedMessage(args: UnionMemberAdded['meta']) {
  return `Member '${args.addedUnionMemberTypeName}' was added to Union type '${args.unionName}'`;
}

export function buildUnionMemberAddedMessageFromMeta(args: UnionMemberAdded) {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Adding a possible type to Unions may break existing clients that were not programming defensively against a new possible type.',
    },
    type: ChangeType.UnionMemberAdded,
    message: buildUnionMemberAddedMessage(args.meta),
    meta: args.meta,
    path: args.meta.unionName,
  } as const;
}

export function unionMemberAdded(
  union: GraphQLUnionType,
  type: GraphQLObjectType,
): Change<ChangeType.UnionMemberAdded> {
  return buildUnionMemberAddedMessageFromMeta({
    type: ChangeType.UnionMemberAdded,
    meta: {
      unionName: union.name,
      addedUnionMemberTypeName: type.name,
    },
  });
}
