import { GraphQLField, GraphQLObjectType } from 'graphql';

import { Change } from '../changes/change';
import {
  fieldDescriptionChanged,
  fieldDeprecationReasonChanged,
  fieldTypeChanged,
} from '../changes/field';

export function changesInField(
  type: GraphQLObjectType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change[] {
  const changes: Change[] = [];

  if (oldField.description !== newField.description) {
    changes.push(fieldDescriptionChanged(type, oldField, newField));
  }

  if (oldField.deprecationReason !== newField.deprecationReason) {
    changes.push(fieldDeprecationReasonChanged(type, oldField, newField));
  }

  if (oldField.type !== newField.type) {
    changes.push(fieldTypeChanged(type, oldField, newField));
  }

  // https://github.com/xuorig/graphql-schema_comparator/blob/master/lib/graphql/schema_comparator/diff/field.rb
  // TODO: compare arguments

  return changes;
}
