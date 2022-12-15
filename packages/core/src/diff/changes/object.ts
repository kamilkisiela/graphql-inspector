import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { Change, ChangeType,CriticalityLevel } from './change';

export function objectTypeInterfaceAdded(iface: GraphQLInterfaceType, type: GraphQLObjectType): Change {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.',
    },
    type: ChangeType.ObjectTypeInterfaceAdded,
    message: `'${type.name}' object implements '${iface.name}' interface`,
    path: type.name,
  };
}

export function objectTypeInterfaceRemoved(iface: GraphQLInterfaceType, type: GraphQLObjectType): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason:
        'Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.',
    },
    type: ChangeType.ObjectTypeInterfaceRemoved,
    message: `'${type.name}' object type no longer implements '${iface.name}' interface`,
    path: type.name,
  };
}
