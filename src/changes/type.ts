import {GraphQLNamedType} from 'graphql';

import {Change, CriticalityLevel} from './change';

export function typeRemoved(type: GraphQLNamedType): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: `Type '${type.name}' was removed`,
    path: type.name,
  };
}
export function typeAdded(type: GraphQLNamedType): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
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
    message: `Description '${oldType.description}' on type '${
      oldType.name
    }' has changed to '${newType.description}'`,
    path: oldType.name,
  };
}
