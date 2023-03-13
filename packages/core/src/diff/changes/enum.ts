import { GraphQLEnumType, GraphQLEnumValue } from 'graphql';
import { isDeprecated } from '../../utils/is-deprecated';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  EnumValueAdded,
  EnumValueDeprecationReasonAdded,
  EnumValueDeprecationReasonChanged,
  EnumValueDeprecationReasonRemoved,
  EnumValueDescriptionChanged,
  EnumValueRemoved,
} from './change';

function buildEnumValueRemovedMessage(args: EnumValueRemoved) {
  return `Enum value '${args.meta.removedEnumValueName}' ${
    args.meta.isEnumValueDeprecated ? '(deprecated) ' : ''
  }was removed from enum '${args.meta.enumName}'`;
}

export function enumValueRemoved(
  oldEnum: GraphQLEnumType,
  value: GraphQLEnumValue,
): Change<ChangeType.EnumValueRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Removing an enum value will cause existing queries that use this enum value to error.`,
    },
    type: ChangeType.EnumValueRemoved,
    get message() {
      return buildEnumValueRemovedMessage(this);
    },
    path: [oldEnum.name, value.name].join('.'),
    meta: {
      enumName: oldEnum.name,
      removedEnumValueName: value.name,
      isEnumValueDeprecated: isDeprecated(value),
    },
  };
}

function buildEnumValueAddedMessage(args: EnumValueAdded) {
  return `Enum value '${args.meta.addedEnumValueName}' was added to enum '${args.meta.enumName}'`;
}

export function enumValueAdded(
  newEnum: GraphQLEnumType,
  value: GraphQLEnumValue,
): Change<ChangeType.EnumValueAdded> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason: `Adding an enum value may break existing clients that were not programming defensively against an added case when querying an enum.`,
    },
    type: ChangeType.EnumValueAdded,
    get message() {
      return buildEnumValueAddedMessage(this);
    },
    path: [newEnum.name, value.name].join('.'),
    meta: {
      enumName: newEnum.name,
      addedEnumValueName: value.name,
    },
  };
}

function buildEnumValueDescriptionChangedMessage(args: EnumValueDescriptionChanged) {
  return args.meta.oldEnumValueDescription === null
    ? `Description '${args.meta.newEnumValueDescription ?? 'undefined'}' was added to enum value '${
        args.meta.enumName
      }.${args.meta.enumValueName}'`
    : `Description for enum value '${args.meta.enumName}.${
        args.meta.enumValueName
      }' changed from '${args.meta.oldEnumValueDescription ?? 'undefined'}' to '${
        args.meta.newEnumValueDescription ?? 'undefined'
      }'`;
}

export function enumValueDescriptionChanged(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDescriptionChanged,
    get message() {
      return buildEnumValueDescriptionChangedMessage(this);
    },
    path: [newEnum.name, oldValue.name].join('.'),
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      oldEnumValueDescription: oldValue.description ?? null,
      newEnumValueDescription: newValue.description ?? null,
    },
  };
}

function buildEnumValueDeprecationChangedMessage(args: EnumValueDeprecationReasonChanged) {
  return `Enum value '${args.meta.enumName}.${args.meta.enumValueName}' deprecation reason changed from '${args.meta.oldEnumValueDeprecationReason}' to '${args.meta.newEnumValueDeprecationReason}'`;
}

export function enumValueDeprecationReasonChanged(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDeprecationReasonChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonChanged,
    get message() {
      return buildEnumValueDeprecationChangedMessage(this);
    },
    path: [newEnum.name, oldValue.name].join('.'),
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      oldEnumValueDeprecationReason: oldValue.deprecationReason ?? '',
      newEnumValueDeprecationReason: newValue.deprecationReason ?? '',
    },
  };
}

function buildEnumValueDeprecationReasonAddedMessage(args: EnumValueDeprecationReasonAdded) {
  return `Enum value '${args.meta.enumName}.${args.meta.enumValueName}' was deprecated with reason '${args.meta.addedValueDeprecationReason}'`;
}

export function enumValueDeprecationReasonAdded(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDeprecationReasonAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonAdded,
    get message() {
      return buildEnumValueDeprecationReasonAddedMessage(this);
    },
    path: [newEnum.name, oldValue.name].join('.'),
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      addedValueDeprecationReason: newValue.deprecationReason ?? '',
    },
  };
}

function buildEnumValueDeprecationReasonRemovedMessage(args: EnumValueDeprecationReasonRemoved) {
  return `Deprecation reason was removed from enum value '${args.meta.enumName}.${args.meta.enumValueName}'`;
}

export function enumValueDeprecationReasonRemoved(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  _newValue: GraphQLEnumValue,
): Change<ChangeType.EnumValueDeprecationReasonRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonRemoved,
    get message() {
      return buildEnumValueDeprecationReasonRemovedMessage(this);
    },
    meta: {
      enumName: newEnum.name,
      enumValueName: oldValue.name,
      removedEnumValueDeprecationReason: oldValue.deprecationReason ?? '',
    },
  };
}
