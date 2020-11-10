import {GraphQLField, GraphQLObjectType, GraphQLInterfaceType} from 'graphql';

import {isNotEqual, isVoid} from '../utils/compare';
import {
  fieldDescriptionChanged,
  fieldDescriptionAdded,
  fieldDescriptionRemoved,
  fieldDeprecationAdded,
  fieldDeprecationRemoved,
  fieldDeprecationReasonChanged,
  fieldDeprecationReasonAdded,
  fieldDeprecationReasonRemoved,
  fieldTypeChanged,
  fieldArgumentAdded,
  fieldArgumentRemoved,
  fieldAdded,
} from './changes/field';
import {changesInArgument, addedInArgument} from './argument';
import {compareLists} from '../utils/compare';
import {AddChange} from './schema';

export function changesInField(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
  addChange: AddChange,
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

  if (isNotEqual(oldField.isDeprecated, newField.isDeprecated)) {
    if (newField.isDeprecated) {
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
      changesInArgument(
        type,
        oldField,
        arg.oldVersion,
        arg.newVersion,
        addChange,
      );
    },
  });
}

export function addedInField(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
  addChange: AddChange,
) {
  addChange(fieldAdded(type, field));

  if (!isVoid(field.description)) {
    addChange(fieldDescriptionAdded(type, field));
  }

  if (field.isDeprecated) {
    addChange(fieldDeprecationAdded(type, field));
  }

  if (isVoid(field.deprecationReason)) {
    addChange(fieldDeprecationReasonAdded(type, field));
  }

  if (field.args?.length) {
    field.args.forEach((arg) => addedInArgument(type, field, arg, addChange));
  }
}
