import { GraphQLField, GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { isNotEqual, isVoid } from '../utils/compare';
import { compareLists } from '../utils/compare';
import { isDeprecated } from '../utils/isDeprecated';
import { changesInArgument } from './argument';
import {
  fieldArgumentAdded,
  fieldArgumentRemoved,
  fieldDeprecationAdded,
  fieldDeprecationReasonAdded,
  fieldDeprecationReasonChanged,
  fieldDeprecationReasonRemoved,
  fieldDeprecationRemoved,
  fieldDescriptionAdded,
  fieldDescriptionChanged,
  fieldDescriptionRemoved,
  fieldTypeChanged,
} from './changes/field';
import { AddChange } from './schema';

export function changesInField(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
  addChange: AddChange
) {
  if (isNotEqual(oldField.description, newField.description)) {
    if (isVoid(oldField.description)) {
      addChange(fieldDescriptionAdded(type, newField));
    } else if (isVoid(newField.description)) {
      addChange(fieldDescriptionRemoved(type, oldField));
    } else {
      addChange(fieldDescriptionChanged(type, oldField, newField));
    }
  }

  if (isNotEqual(isDeprecated(oldField), isDeprecated(newField))) {
    if (isDeprecated(newField)) {
      addChange(fieldDeprecationAdded(type, newField));
    } else {
      addChange(fieldDeprecationRemoved(type, oldField));
    }
  }

  if (isNotEqual(oldField.deprecationReason, newField.deprecationReason)) {
    if (isVoid(oldField.deprecationReason)) {
      addChange(fieldDeprecationReasonAdded(type, newField));
    } else if (isVoid(newField.deprecationReason)) {
      addChange(fieldDeprecationReasonRemoved(type, oldField));
    } else {
      addChange(fieldDeprecationReasonChanged(type, oldField, newField));
    }
  }

  if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
    addChange(fieldTypeChanged(type, oldField, newField));
  }

  compareLists(oldField.args, newField.args, {
    onAdded(arg) {
      addChange(fieldArgumentAdded(type, newField, arg));
    },
    onRemoved(arg) {
      addChange(fieldArgumentRemoved(type, oldField, arg));
    },
    onMutual(arg) {
      changesInArgument(type, oldField, arg.oldVersion, arg.newVersion, addChange);
    },
  });
}
