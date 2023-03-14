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
  FieldDeprecationReasonRemoved,
  FieldDeprecationRemoved,
  FieldDescriptionAdded,
  FieldDescriptionChanged,
  FieldDescriptionRemoved,
  FieldRemoved,
  FieldTypeChanged,
} from './change';

function buildFieldRemovedMessage(args: FieldRemoved['meta']) {
  return `Field '${args.removedFieldName}' ${
    args.isRemovedFieldDeprecated ? '(deprecated) ' : ''
  }was removed from ${args.typeType} '${args.typeName}'`;
}

export function fieldRemovedFromMeta(args: FieldRemoved) {
  return {
    type: ChangeType.FieldRemoved,
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: args.meta.isRemovedFieldDeprecated
        ? `Removing a deprecated field is a breaking change. Before removing it, you may want to look at the field's usage to see the impact of removing the field.`
        : `Removing a field is a breaking change. It is preferable to deprecate the field before removing it.`,
    },
    message: buildFieldRemovedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.removedFieldName].join('.'),
  } as const;
}

export function fieldRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
): Change<ChangeType.FieldRemoved> {
  const entity = isInterfaceType(type) ? 'interface' : 'object type';
  return fieldRemovedFromMeta({
    type: ChangeType.FieldRemoved,
    meta: {
      typeName: type.name,
      removedFieldName: field.name,
      isRemovedFieldDeprecated: field.deprecationReason != null,
      typeType: entity,
    },
  });
}

function buildFieldAddedMessage(args: FieldAdded['meta']) {
  return `Field '${args.addedFieldName}' was added to ${args.typeType} '${args.typeName}'`;
}

export function fieldAddedFromMeta(args: FieldAdded) {
  return {
    type: ChangeType.FieldAdded,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldAddedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.addedFieldName].join('.'),
  } as const;
}

export function fieldAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
): Change<ChangeType.FieldAdded> {
  const entity = isInterfaceType(type) ? 'interface' : 'object type';
  return fieldAddedFromMeta({
    type: ChangeType.FieldAdded,
    meta: {
      typeName: type.name,
      addedFieldName: field.name,
      typeType: entity,
    },
  });
}

function buildFieldDescriptionChangedMessage(args: FieldDescriptionChanged['meta']) {
  return `Field '${args.typeName}.${args.fieldName}' description changed from '${args.oldDescription}' to '${args.newDescription}'`;
}

export function fieldDescriptionChangedFromMeta(args: FieldDescriptionChanged) {
  return {
    type: ChangeType.FieldDescriptionChanged,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldDescriptionChangedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDescriptionChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change<ChangeType.FieldDescriptionChanged> {
  return fieldDescriptionChangedFromMeta({
    type: ChangeType.FieldDescriptionChanged,
    meta: {
      fieldName: oldField.name,
      typeName: type.name,
      oldDescription: oldField.description ?? '',
      newDescription: newField.description ?? '',
    },
  });
}

function buildFieldDescriptionAddedMessage(args: FieldDescriptionAdded['meta']) {
  return `Field '${args.typeName}.${args.fieldName}' has description '${args.addedDescription}'`;
}

export function fieldDescriptionAddedFromMeta(args: FieldDescriptionAdded) {
  return {
    type: ChangeType.FieldDescriptionAdded,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldDescriptionAddedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDescriptionAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDescriptionAdded> {
  return fieldDescriptionAddedFromMeta({
    type: ChangeType.FieldDescriptionAdded,
    meta: {
      typeName: type.name,
      fieldName: field.name,
      addedDescription: field.description ?? '',
    },
  });
}

function buildFieldDescriptionRemovedMessage(args: FieldDescriptionRemoved['meta']) {
  return `Description was removed from field '${args.typeName}.${args.fieldName}'`;
}

export function fieldDescriptionRemovedFromMeta(args: FieldDescriptionRemoved) {
  return {
    type: ChangeType.FieldDescriptionRemoved,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldDescriptionRemovedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDescriptionRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDescriptionRemoved> {
  return fieldDescriptionRemovedFromMeta({
    type: ChangeType.FieldDescriptionRemoved,
    meta: {
      typeName: type.name,
      fieldName: field.name,
    },
  });
}

function buildFieldDeprecatedAddedMessage(args: FieldDeprecationAdded['meta']) {
  return `Field '${args.typeName}.${args.fieldName}' is deprecated`;
}

export function fieldDeprecationAddedFromMeta(args: FieldDeprecationAdded) {
  return {
    type: ChangeType.FieldDeprecationAdded,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldDeprecatedAddedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDeprecationAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationAdded> {
  return fieldDeprecationAddedFromMeta({
    type: ChangeType.FieldDeprecationAdded,
    meta: {
      typeName: type.name,
      fieldName: field.name,
    },
  });
}

export function fieldDeprecationRemovedFromMeta(args: FieldDeprecationRemoved) {
  return {
    type: ChangeType.FieldDeprecationRemoved,
    criticality: {
      level: CriticalityLevel.Dangerous,
    },
    message: `Field '${args.meta.typeName}.${args.meta.fieldName}' is no longer deprecated`,
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDeprecationRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationRemoved> {
  return fieldDeprecationRemovedFromMeta({
    type: ChangeType.FieldDeprecationRemoved,
    meta: {
      fieldName: field.name,
      typeName: type.name,
    },
  });
}

function buildFieldDeprecationReasonChangedMessage(args: FieldDeprecationReasonChanged['meta']) {
  return `Deprecation reason on field '${args.typeName}.${args.fieldName}' has changed from '${args.oldDeprecationReason}' to '${args.newDeprecationReason}'`;
}

export function fieldDeprecationReasonChangedFromMeta(args: FieldDeprecationReasonChanged) {
  return {
    type: ChangeType.FieldDeprecationReasonChanged,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldDeprecationReasonChangedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDeprecationReasonChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any>,
  newField: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationReasonChanged> {
  return fieldDeprecationReasonChangedFromMeta({
    type: ChangeType.FieldDeprecationReasonChanged,
    meta: {
      fieldName: newField.name,
      typeName: type.name,
      newDeprecationReason: newField.deprecationReason ?? '',
      oldDeprecationReason: oldField.deprecationReason ?? '',
    },
  });
}

function buildFieldDeprecationReasonAddedMessage(args: FieldDeprecationReasonAdded['meta']) {
  return `Field '${args.typeName}.${args.fieldName}' has deprecation reason '${args.addedDeprecationReason}'`;
}

export function fieldDeprecationReasonAddedFromMeta(args: FieldDeprecationReasonAdded) {
  return {
    type: ChangeType.FieldDeprecationReasonAdded,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: buildFieldDeprecationReasonAddedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDeprecationReasonAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationReasonAdded> {
  return fieldDeprecationReasonAddedFromMeta({
    type: ChangeType.FieldDeprecationReasonAdded,
    meta: {
      typeName: type.name,
      fieldName: field.name,
      addedDeprecationReason: field.deprecationReason ?? '',
    },
  });
}

export function fieldDeprecationReasonRemovedFromMeta(args: FieldDeprecationReasonRemoved) {
  return {
    type: ChangeType.FieldDeprecationReasonRemoved,
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Deprecation reason was removed from field '${args.meta.typeName}.${args.meta.fieldName}'`,
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldDeprecationReasonRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any>,
): Change<ChangeType.FieldDeprecationReasonRemoved> {
  return fieldDeprecationReasonRemovedFromMeta({
    type: ChangeType.FieldDeprecationReasonRemoved,
    meta: {
      typeName: type.name,
      fieldName: field.name,
    },
  });
}

function buildFieldTypeChangedMessage(args: FieldTypeChanged) {
  return `Field '${args.meta.typeName}.${args.meta.fieldName}' changed type from '${args.meta.oldFieldType}' to '${args.meta.newFieldType}'`;
}

export function fieldTypeChangedFromMeta(args: FieldTypeChanged) {
  return {
    type: ChangeType.FieldTypeChanged,
    criticality: {
      level: args.meta.isSafeFieldTypeChange
        ? CriticalityLevel.NonBreaking
        : CriticalityLevel.Breaking,
    },
    message: buildFieldTypeChangedMessage(args),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName].join('.'),
  } as const;
}

export function fieldTypeChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  oldField: GraphQLField<any, any, any>,
  newField: GraphQLField<any, any, any>,
): Change<ChangeType.FieldTypeChanged> {
  return fieldTypeChangedFromMeta({
    type: ChangeType.FieldTypeChanged,
    meta: {
      typeName: type.name,
      fieldName: oldField.name,
      oldFieldType: oldField.type.toString(),
      newFieldType: newField.type.toString(),
      isSafeFieldTypeChange: safeChangeForField(oldField.type, newField.type),
    },
  });
}

function buildFieldArgumentAddedMessage(args: FieldArgumentAdded['meta']) {
  return `Argument '${args.addedArgumentName}: ${args.addedArgumentType}'${
    args.hasDefaultValue ? ' (with default value) ' : ' '
  }added to field '${args.typeName}.${args.fieldName}'`;
}

export function fieldArgumentAddedFromMeta(args: FieldArgumentAdded) {
  return {
    type: ChangeType.FieldArgumentAdded,
    criticality: {
      level: args.meta.isAddedFieldArgumentBreaking
        ? CriticalityLevel.Breaking
        : CriticalityLevel.Dangerous,
    },
    message: buildFieldArgumentAddedMessage(args.meta),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName, args.meta.addedArgumentName].join('.'),
  } as const;
}

export function fieldArgumentAdded(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  arg: GraphQLArgument,
): Change<ChangeType.FieldArgumentAdded> {
  const isBreaking = isNonNullType(arg.type) && typeof arg.defaultValue === 'undefined';

  return fieldArgumentAddedFromMeta({
    type: ChangeType.FieldArgumentAdded,
    meta: {
      typeName: type.name,
      fieldName: field.name,
      addedArgumentName: arg.name,
      addedArgumentType: arg.type.toString(),
      hasDefaultValue: arg.defaultValue != null,
      isAddedFieldArgumentBreaking: isBreaking,
    },
  });
}

function buildFieldArgumentRemovedMessage(args: FieldArgumentRemoved) {
  return `Argument '${args.meta.removedFieldArgumentName}: ${args.meta.removedFieldType}' was removed from field '${args.meta.typeName}.${args.meta.fieldName}'`;
}

export function fieldArgumentRemovedFromMeta(args: FieldArgumentRemoved) {
  return {
    type: ChangeType.FieldArgumentRemoved,
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: buildFieldArgumentRemovedMessage(args),
    meta: args.meta,
    path: [args.meta.typeName, args.meta.fieldName, args.meta.removedFieldArgumentName].join('.'),
  } as const;
}

export function fieldArgumentRemoved(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  arg: GraphQLArgument,
): Change<ChangeType.FieldArgumentRemoved> {
  return fieldArgumentRemovedFromMeta({
    type: ChangeType.FieldArgumentRemoved,
    meta: {
      typeName: type.name,
      fieldName: field.name,
      removedFieldArgumentName: arg.name,
      removedFieldType: arg.type.toString(),
    },
  });
}
