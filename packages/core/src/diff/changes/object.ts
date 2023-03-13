import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  ObjectTypeInterfaceAdded,
  ObjectTypeInterfaceRemoved,
} from './change';

function buildObjectTypeInterfaceAddedMessage(args: ObjectTypeInterfaceAdded) {
  return `'${args.meta.objectTypeName}' object implements '${args.meta.addedInterfaceName}' interface`;
}

export function objectTypeInterfaceAdded(
  iface: GraphQLInterfaceType,
  type: GraphQLObjectType,
): Change<ChangeType.ObjectTypeInterfaceAdded> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.',
    },
    type: ChangeType.ObjectTypeInterfaceAdded,
    get message() {
      return buildObjectTypeInterfaceAddedMessage(this);
    },
    path: type.name,
    meta: {
      objectTypeName: type.name,
      addedInterfaceName: iface.name,
    },
  };
}

function buildObjectTypeInterfaceRemovedMessage(args: ObjectTypeInterfaceRemoved) {
  return `'${args.meta.objectTypeName}' object type no longer implements '${args.meta.removedInterfaceName}' interface`;
}

export function objectTypeInterfaceRemoved(
  iface: GraphQLInterfaceType,
  type: GraphQLObjectType,
): Change<ChangeType.ObjectTypeInterfaceRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.',
    },
    type: ChangeType.ObjectTypeInterfaceRemoved,
    get message() {
      return buildObjectTypeInterfaceRemovedMessage(this);
    },
    path: type.name,
    meta: {
      objectTypeName: type.name,
      removedInterfaceName: iface.name,
    },
  };
}
