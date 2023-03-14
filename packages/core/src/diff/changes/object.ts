import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  ObjectTypeInterfaceAdded,
  ObjectTypeInterfaceRemoved,
} from './change';

function buildObjectTypeInterfaceAddedMessage(args: ObjectTypeInterfaceAdded['meta']) {
  return `'${args.objectTypeName}' object implements '${args.addedInterfaceName}' interface`;
}

export function objectTypeInterfaceAddedFromMeta(args: ObjectTypeInterfaceAdded) {
  return {
    type: ChangeType.ObjectTypeInterfaceAdded,
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.',
    },
    message: buildObjectTypeInterfaceAddedMessage(args.meta),
    meta: args.meta,
    path: args.meta.objectTypeName,
  } as const;
}

export function objectTypeInterfaceAdded(
  iface: GraphQLInterfaceType,
  type: GraphQLObjectType,
): Change<ChangeType.ObjectTypeInterfaceAdded> {
  return objectTypeInterfaceAddedFromMeta({
    type: ChangeType.ObjectTypeInterfaceAdded,
    meta: {
      objectTypeName: type.name,
      addedInterfaceName: iface.name,
    },
  });
}

function buildObjectTypeInterfaceRemovedMessage(args: ObjectTypeInterfaceRemoved['meta']) {
  return `'${args.objectTypeName}' object type no longer implements '${args.removedInterfaceName}' interface`;
}

export function objectTypeInterfaceRemovedFromMeta(args: ObjectTypeInterfaceRemoved) {
  return {
    type: ChangeType.ObjectTypeInterfaceRemoved,
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.',
    },
    message: buildObjectTypeInterfaceRemovedMessage(args.meta),
    meta: args.meta,
    path: args.meta.objectTypeName,
  } as const;
}

export function objectTypeInterfaceRemoved(
  iface: GraphQLInterfaceType,
  type: GraphQLObjectType,
): Change<ChangeType.ObjectTypeInterfaceRemoved> {
  return objectTypeInterfaceRemovedFromMeta({
    type: ChangeType.ObjectTypeInterfaceRemoved,
    meta: {
      objectTypeName: type.name,
      removedInterfaceName: iface.name,
    },
  });
}
