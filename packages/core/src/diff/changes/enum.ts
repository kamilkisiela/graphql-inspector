import { GraphQLEnumType, GraphQLEnumValue } from 'graphql';
import { isDeprecated } from '../../utils/isDeprecated';
import { Change, ChangeType, CriticalityLevel } from './change';

export function enumValueRemoved(oldEnum: GraphQLEnumType, value: GraphQLEnumValue): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
      reason: `Removing an enum value will cause existing queries that use this enum value to error.`,
    },
    type: ChangeType.EnumValueRemoved,
    message: `Enum value '${value.name}' ${
      isDeprecated(value) ? '(deprecated) ' : ''
    }was removed from enum '${oldEnum.name}'`,
    path: [oldEnum.name, value.name].join('.'),
  };
}

export function enumValueAdded(newEnum: GraphQLEnumType, value: GraphQLEnumValue): Change {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason: `Adding an enum value may break existing clients that were not programming defensively against an added case when querying an enum.`,
    },
    type: ChangeType.EnumValueAdded,
    message: `Enum value '${value.name}' was added to enum '${newEnum.name}'`,
    path: [newEnum.name, value.name].join('.'),
  };
}

export function enumValueDescriptionChanged(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDescriptionChanged,
    message:
      typeof oldValue.description === 'undefined'
        ? `Description '${newValue.description}' was added to enum value '${newEnum.name}.${newValue.name}'`
        : `Description for enum value '${newEnum.name}.${newValue.name}' changed from '${oldValue.description}' to '${newValue.description}'`,
    path: [newEnum.name, oldValue.name].join('.'),
  };
}

export function enumValueDeprecationReasonChanged(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonChanged,
    message: `Enum value '${newEnum.name}.${newValue.name}' deprecation reason changed from '${oldValue.deprecationReason}' to '${newValue.deprecationReason}'`,
    path: [newEnum.name, oldValue.name].join('.'),
  };
}

export function enumValueDeprecationReasonAdded(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonAdded,
    message: `Enum value '${newEnum.name}.${newValue.name}' was deprecated with reason '${newValue.deprecationReason}'`,
    path: [newEnum.name, oldValue.name].join('.'),
  };
}

export function enumValueDeprecationReasonRemoved(
  newEnum: GraphQLEnumType,
  oldValue: GraphQLEnumValue,
  newValue: GraphQLEnumValue,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.EnumValueDeprecationReasonRemoved,
    message: `Deprecation reason was removed from enum value '${newEnum.name}.${newValue.name}'`,
    path: [newEnum.name, oldValue.name].join('.'),
  };
}
