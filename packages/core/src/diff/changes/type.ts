import {GraphQLNamedType} from 'graphql';

import {Change, CriticalityLevel, ChangeType} from './change';

export function typeRemoved(type: GraphQLNamedType): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.TypeRemoved,
    message: `Type '${type.name}' was removed`,
    path: type.name,
  };
}
export function typeAdded(type: GraphQLNamedType): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeAdded,
    message: `Type '${type.name}' was added`,
    path: type.name,
  };
}
export function typeKindChanged(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Changing the kind of a type is a breaking change because it can cause existing queries to error. For example, turning an object type to a scalar type would break queries that define a selection set for this type.`,
    },
    type: ChangeType.TypeKindChanged,
    message: `'${oldType.name}' kind changed from '${
      (oldType.astNode as any).kind
    }' to '${(newType.astNode as any).kind}'`,
    path: oldType.name,
  };
}
export function typeDescriptionChanged(
  oldType: GraphQLNamedType,
  newType: GraphQLNamedType,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.TypeDescriptionChanged,
    message: `Description '${oldType.description}' on type '${
      oldType.name
    }' has changed to '${newType.description}'`,
    path: oldType.name,
  };
}
