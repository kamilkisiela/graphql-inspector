import { GraphQLArgument, GraphQLField, GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { safeChangeForInputValue } from '../../utils/graphql';
import { safeString } from '../../utils/string';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  FieldArgumentDefaultChanged,
  FieldArgumentDescriptionChanged,
  FieldArgumentTypeChanged,
} from './change';

function buildFieldArgumentDescriptionChangedMessage(
  args: FieldArgumentDescriptionChanged,
): string {
  return `Description for argument '${args.meta.argumentName}' on field '${args.meta.typeName}.${args.meta.fieldName}' changed from '${args.meta.oldDescription}' to '${args.meta.newDescription}'`;
}

export function fieldArgumentDescriptionChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change<ChangeType.FieldArgumentDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.FieldArgumentDescriptionChanged,
    get message() {
      return buildFieldArgumentDescriptionChangedMessage(this);
    },
    path: [type.name, field.name, oldArg.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      argumentName: oldArg.name,
      oldDescription: oldArg.description ?? null,
      newDescription: newArg.description ?? null,
    },
  };
}

function buildFieldArgumentDefaultChangedMessage(args: FieldArgumentDefaultChanged): string {
  return args.meta.oldDefaultValue === undefined
    ? `Default value '${args.meta.newDefaultValue}' was added to argument '${args.meta.argumentName}' on field '${args.meta.typeName}.${args.meta.fieldName}'`
    : `Default value for argument '${args.meta.argumentName}' on field '${args.meta.typeName}.${args.meta.fieldName}' changed from '${args.meta.oldDefaultValue}' to '${args.meta.newDefaultValue}'`;
}

export function fieldArgumentDefaultChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change<ChangeType.FieldArgumentDefaultChanged> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
    },
    type: ChangeType.FieldArgumentDefaultChanged,
    get message() {
      return buildFieldArgumentDefaultChangedMessage(this);
    },
    path: [type.name, field.name, oldArg.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      argumentName: newArg.name,
      oldDefaultValue:
        oldArg.defaultValue == undefined ? undefined : safeString(oldArg.defaultValue),
      newDefaultValue:
        newArg.defaultValue == undefined ? undefined : safeString(newArg.defaultValue),
    },
  };
}

function buildFieldArgumentTypeChangedMessage(args: FieldArgumentTypeChanged): string {
  return `Type for argument '${args.meta.argumentName}' on field '${args.meta.typeName}.${args.meta.fieldName}' changed from '${args.meta.oldArgumentType}' to '${args.meta.newArgumentType}'`;
}

export function fieldArgumentTypeChanged(
  type: GraphQLObjectType | GraphQLInterfaceType,
  field: GraphQLField<any, any, any>,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change<ChangeType.FieldArgumentTypeChanged> {
  return {
    criticality: safeChangeForInputValue(oldArg.type, newArg.type)
      ? {
          level: CriticalityLevel.NonBreaking,
          reason: `Changing an input field from non-null to null is considered non-breaking.`,
        }
      : {
          level: CriticalityLevel.Breaking,
          reason: `Changing the type of a field's argument can cause existing queries that use this argument to error.`,
        },
    type: ChangeType.FieldArgumentTypeChanged,
    get message() {
      return buildFieldArgumentTypeChangedMessage(this);
    },
    path: [type.name, field.name, oldArg.name].join('.'),
    meta: {
      typeName: type.name,
      fieldName: field.name,
      argumentName: newArg.name,
      oldArgumentType: oldArg.type.toString(),
      newArgumentType: newArg.type.toString(),
    },
  };
}
