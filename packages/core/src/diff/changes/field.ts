import {
  GraphQLArgument,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
  isInterfaceType,
  isNonNullType,
} from 'graphql';
import { safeChangeForField } from '../../utils/graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  FieldAdded,
  FieldArgumentAdded,
  FieldArgumentRemoved,
  FieldDeprecationAdded,
  FieldDeprecationReasonAdded,
  FieldDeprecationReasonChanged,
  FieldDescriptionAdded,
  FieldDescriptionChanged,
  FieldDescriptionRemoved,
  FieldRemoved,
  FieldTypeChanged,
} from './change';

function buildFieldRemovedMessage(args: FieldRemoved) {
  return `Field '${args.meta.removedFieldName}' ${
    args.meta.isRemovedFieldDeprecated ? '(deprecated) ' : ''
  }was removed from ${args.meta.typeType} '${args.meta.typeName}'`;
}

export function fieldRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
): Change<ChangeType.FieldRemoved> {
  const entity = isInterfaceType(type) ? 'interface' : 'object type';
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: field.deprecationReason
        ? `Removing a deprecated field is a breaking change. Before removing it, you may want to look at the field's usage to see the impact of removing the field.`
        : `Removing a field is a breaking change. It is preferable to deprecate the field before removing it.`,
    },
    type: ChangeType.FieldRemoved,
    get message() {
      return buildFieldRemovedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      removedFieldName: field.name,
      isRemovedFieldDeprecated: field.deprecationReason != null,
      typeType: entity,
    },
  };
}

function buildFieldAddedMessage(args: FieldAdded) {
  return `Field '${args.meta.addedFieldName}' was added to ${args.meta.typeType} '${args.meta.typeName}'`;
}

export function fieldAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
): Change<ChangeType.FieldAdded> {
  const entity = isInterfaceType(type) ? 'interface' : 'object type';
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldAdded,
    get message() {
      return buildFieldAddedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      addedFieldName: field.name,
      typeType: entity,
    },
  };
}

function buildFieldDescriptionChangedMessage(args: FieldDescriptionChanged) {
  return `Field '${args.meta.typeName}.${args.meta.fieldName}' description changed from '${args.meta.oldDescription}' to '${args.meta.newDescription}'`;
}

export function fieldDescriptionChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change<ChangeType.FieldDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDescriptionChanged,
    get message() {
      return buildFieldDescriptionChangedMessage(this);
    },
    path: [type.name, oldField.name].join('.'),
    meta: {
      fieldName: oldField.name,
      typeName: type.name,
      oldDescription: oldField.description ?? '',
      newDescription: newField.description ?? '',
    },
  };
}

function buildFieldDescriptionAddedMessage(args: FieldDescriptionAdded) {
  return `Field '${args.meta.typeName}.${args.meta.fieldName}' has description '${args.meta.addedDescription}'`;
}

export function fieldDescriptionAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDescriptionAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDescriptionAdded,
    get message() {
      return buildFieldDescriptionAddedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      addedDescription: field.description ?? '',
    },
  };
}

function buildFieldDescriptionRemovedMessage(args: FieldDescriptionRemoved) {
  return `Description was removed from field '${args.meta.typeName}.${args.meta.fieldName}'`;
}

export function fieldDescriptionRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDescriptionRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDescriptionRemoved,
    get message() {
      return buildFieldDescriptionRemovedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
    },
  };
}

function buildFieldDeprecatedAddedMessage(args: FieldDeprecationAdded) {
  return `Field '${args.meta.typeName}.${args.meta.fieldName}' is deprecated`;
}

export function fieldDeprecationAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDeprecationAdded,
    get message() {
      return buildFieldDeprecatedAddedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
    },
  };
}

export function fieldDeprecationRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
    },
    type: ChangeType.FieldDeprecationRemoved,
    message: `Field '${type.name}.${field.name}' is no longer deprecated`,
    path: [type.name, field.name].join('.'),
    meta: {
      fieldName: field.name,
      typeName: type.name,
    },
  };
}

function buildFieldDeprecationReasonChangedMessage(args: FieldDeprecationReasonChanged) {
  return `Deprecation reason on field '${args.meta.typeName}.${args.meta.fieldName}' has changed from '${args.meta.oldDeprecationReason}' to '${args.meta.newDeprecationReason}'`;
}

export function fieldDeprecationReasonChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationReasonChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDeprecationReasonChanged,
    get message() {
      return buildFieldDeprecationReasonChangedMessage(this);
    },
    path: [type.name, oldField.name].join('.'),
    meta: {
      fieldName: newField.name,
      typeName: type.name,
      newDeprecationReason: newField.deprecationReason ?? '',
      oldDeprecationReason: oldField.deprecationReason ?? '',
    },
  };
}

function buildFieldDeprecationReasonAddedMessage(args: FieldDeprecationReasonAdded) {
  return `Field '${args.meta.typeName}.${args.meta.fieldName}' has deprecation reason '${args.meta.addedDeprecationReason}'`;
}

export function fieldDeprecationReasonAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationReasonAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDeprecationReasonAdded,
    get message() {
      return buildFieldDeprecationReasonAddedMessage(this);
    },
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      addedDeprecationReason: field.deprecationReason ?? '',
    },
  };
}

export function fieldDeprecationReasonRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationReasonRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldDeprecationReasonRemoved,
    message: `Deprecation reason was removed from field '${type.name}.${field.name}'`,
    path: [type.name, field.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
    },
  };
}

function buildFieldTypeChangedMessage(args: FieldTypeChanged) {
  return `Field '${args.meta.typeName}.${args.meta.fieldName}' changed type from '${args.meta.oldFieldType}' to '${args.meta.newFieldType}'`;
}

export function fieldTypeChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any, any>,
  newField: GraphQLField<any, any, any>,
): Change<ChangeType.FieldTypeChanged> {
  return {
    criticality: {
      level: safeChangeForField(oldField.type, newField.type)
        ? CriticalityLevel.NonBreaking
        : CriticalityLevel.Breaking,
    },
    type: ChangeType.FieldTypeChanged,
    get message() {
      return buildFieldTypeChangedMessage(this);
    },
    path: [type.name, oldField.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: oldField.name,
      oldFieldType: oldField.type.toString(),
      newFieldType: newField.type.toString(),
    },
  };
}

function buildFieldArgumentAddedMessage(args: FieldArgumentAdded) {
  return `Argument '${args.meta.addedArgumentName}: ${args.meta.addedArgumentType}'${
    args.meta.hasDefaultValue ? ' (with default value) ' : ' '
  }added to field '${args.meta.typeName}.${args.meta.fieldName}'`;
}

export function fieldArgumentAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  arg: GraphQLArgument,
): Change<ChangeType.FieldArgumentAdded> {
  const isBreaking = isNonNullType(arg.type) && typeof arg.defaultValue === 'undefined';

  return {
    criticality: isBreaking
      ? {
          level: CriticalityLevel.Breaking,
          reason: `Adding a required argument to an existing field is a breaking change because it will cause existing uses of this field to error.`,
        }
      : {
          level: CriticalityLevel.Dangerous,
          reason: `Adding a new argument to an existing field may involve a change in resolve function logic that potentially may cause some side effects.`,
        },
    type: ChangeType.FieldArgumentAdded,
    get message() {
      return buildFieldArgumentAddedMessage(this);
    },
    path: [type.name, field.name, arg.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      addedArgumentName: arg.name,
      addedArgumentType: arg.type.toString(),
      hasDefaultValue: arg.defaultValue != null,
    },
  };
}

function buildFieldArgumentRemovedMessage(args: FieldArgumentRemoved) {
  return `Argument '${args.meta.removedFieldArgumentName}: ${args.meta.removedFieldType}' was removed from field '${args.meta.typeName}.${args.meta.fieldName}'`;
}

export function fieldArgumentRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  arg: GraphQLArgument,
): Change<ChangeType.FieldArgumentRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Removing a field argument is a breaking change because it will cause existing queries that use this argument to error.`,
    },
    type: ChangeType.FieldArgumentRemoved,
    get message() {
      return buildFieldArgumentRemovedMessage(this);
    },
    path: [type.name, field.name, arg.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      removedFieldArgumentName: arg.name,
      removedFieldType: arg.type.toString(),
    },
  };
}
