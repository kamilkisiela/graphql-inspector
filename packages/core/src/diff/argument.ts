import {
  GraphQLArgument,
  GraphQLObjectType,
  GraphQLField,
  GraphQLInterfaceType,
} from 'graphql';

import {diffArrays, isNotEqual} from '../utils/compare';
import {Change} from './changes/change';
import {
  fieldArgumentDescriptionChanged,
  fieldArgumentDefaultChanged,
  fieldArgumentTypeChanged,
} from './changes/argument';

export function changesInArgument(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change[] {
  const changes: Change[] = [];

  if (isNotEqual(oldArg.description, newArg.description)) {
    changes.push(fieldArgumentDescriptionChanged(type, field, oldArg, newArg));
  }

  if (isNotEqual(oldArg.defaultValue, newArg.defaultValue)) {
    if (
      Array.isArray(oldArg.defaultValue) &&
      Array.isArray(newArg.defaultValue)
    ) {
      const diff = diffArrays(oldArg.defaultValue, newArg.defaultValue);
      if (diff.length > 0) {
        changes.push(fieldArgumentDefaultChanged(type, field, oldArg, newArg));
      }
    } else if (
      JSON.stringify(oldArg.defaultValue) !==
      JSON.stringify(newArg.defaultValue)
    ) {
      changes.push(fieldArgumentDefaultChanged(type, field, oldArg, newArg));
    }
  }

  if (isNotEqual(oldArg.type.toString(), newArg.type.toString())) {
    changes.push(fieldArgumentTypeChanged(type, field, oldArg, newArg));
  }

  return changes;
}
