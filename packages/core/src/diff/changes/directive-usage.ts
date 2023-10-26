import {
  ConstDirectiveNode,
  GraphQLArgument,
  GraphQLEnumType,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  Kind,
} from 'graphql';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  DirectiveUsageArgumentDefinitionChange,
  DirectiveUsageArgumentDefinitionRemovedChange,
  DirectiveUsageEnumAddedChange,
  DirectiveUsageEnumRemovedChange,
  DirectiveUsageEnumValueAddedChange,
  DirectiveUsageEnumValueRemovedChange,
  DirectiveUsageFieldDefinitionAddedChange,
  DirectiveUsageFieldDefinitionRemovedChange,
  DirectiveUsageInputObjectAddedChange,
  DirectiveUsageInputObjectdRemovedChange,
  DirectiveUsageInterfaceAddedChange,
  DirectiveUsageInterfaceRemovedChange,
  DirectiveUsageObjectAddedChange,
  DirectiveUsageObjectRemovedChange,
  DirectiveUsageScalarAddedChange,
  DirectiveUsageScalarRemovedChange,
  DirectiveUsageSchemaAddedChange,
  DirectiveUsageSchemaRemovedChange,
  DirectiveUsageUnionMemberAddedChange,
  DirectiveUsageUnionMemberRemovedChange,
} from './change.js';

function addedSpecialDirective(directiveName: string, forceReturn: CriticalityLevel) {
  if (directiveName === 'deprecated') {
    return CriticalityLevel.NonBreaking;
  }
  if (directiveName === 'oneOf') {
    return CriticalityLevel.Breaking;
  }
  return forceReturn;
}

function removedSpecialDirective(directiveName: string, forceReturn: CriticalityLevel) {
  if (directiveName === 'deprecated') {
    return CriticalityLevel.NonBreaking;
  }
  if (directiveName === 'oneOf') {
    return CriticalityLevel.NonBreaking;
  }
  return forceReturn;
}

type KindToPayload = {
  [Kind.ENUM_TYPE_DEFINITION]: {
    input: GraphQLEnumType;
    change: DirectiveUsageEnumAddedChange | DirectiveUsageEnumRemovedChange;
  };
  [Kind.FIELD_DEFINITION]: {
    input: {
      field: GraphQLField<any, any, any>;
      parentType: GraphQLInterfaceType | GraphQLObjectType<any, any>;
    };
    change: DirectiveUsageFieldDefinitionAddedChange | DirectiveUsageFieldDefinitionRemovedChange;
  };
  [Kind.UNION_TYPE_DEFINITION]: {
    input: GraphQLUnionType;
    change: DirectiveUsageUnionMemberAddedChange | DirectiveUsageUnionMemberRemovedChange;
  };
  [Kind.ENUM_VALUE_DEFINITION]: {
    input: {
      type: GraphQLEnumType;
      value: GraphQLEnumValue;
    };
    change: DirectiveUsageEnumValueAddedChange | DirectiveUsageEnumValueRemovedChange;
  };
  [Kind.SCHEMA_DEFINITION]: {
    input: GraphQLSchema;
    change: DirectiveUsageSchemaAddedChange | DirectiveUsageSchemaRemovedChange;
  };
  [Kind.SCALAR_TYPE_DEFINITION]: {
    input: GraphQLScalarType;
    change: DirectiveUsageScalarAddedChange | DirectiveUsageScalarRemovedChange;
  };
  [Kind.OBJECT]: {
    input: GraphQLObjectType;
    change: DirectiveUsageObjectAddedChange | DirectiveUsageObjectRemovedChange;
  };
  [Kind.INTERFACE_TYPE_DEFINITION]: {
    input: GraphQLInterfaceType;
    change: DirectiveUsageInterfaceAddedChange | DirectiveUsageInterfaceRemovedChange;
  };
  [Kind.INPUT_OBJECT_TYPE_DEFINITION]: {
    input: GraphQLInputObjectType;
    change: DirectiveUsageInputObjectAddedChange | DirectiveUsageInputObjectdRemovedChange;
  };
  [Kind.INPUT_VALUE_DEFINITION]: {
    input: {
      field: GraphQLInputField;
      type: GraphQLInputObjectType;
    };
    change: DirectiveUsageArgumentDefinitionChange | DirectiveUsageArgumentDefinitionRemovedChange;
  };
  [Kind.ARGUMENT]: {
    input: {
      field: GraphQLField<any, any, any>;
      type: GraphQLObjectType | GraphQLInterfaceType;
      argument: GraphQLArgument;
    };
    change: DirectiveUsageArgumentDefinitionChange | DirectiveUsageArgumentDefinitionRemovedChange;
  };
};

export function directiveUsageAdded<K extends keyof KindToPayload>(
  kind: K,
  directive: ConstDirectiveNode,
  payload: KindToPayload[K]['input'],
): Change {
  if (isOfKind(kind, Kind.ARGUMENT, payload)) {
    return {
      type: ChangeType.DirectiveUsageArgumentDefinitionAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to argument '${payload.argument.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to argument '${payload.argument.name}'`,
      meta: {
        argumentName: payload.argument.name,
        addedDirectiveName: directive.name.value,
        fieldName: payload.field.name,
        typeName: payload.type.name,
      },
      path: [
        payload.type.name,
        payload.field.name,
        payload.argument.name,
        directive.name.value,
      ].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.INPUT_VALUE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageArgumentDefinitionAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to argument '${payload.field.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to argument '${payload.field.name}'`,
      meta: {
        argumentName: payload.field.name,
        addedDirectiveName: directive.name.value,
        fieldName: payload.type.name,
        typeName: payload.type.name,
      },
      path: [payload.type.name, payload.field.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.INPUT_OBJECT_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageInputObjectAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to input object '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to input object '${payload.name}'`,
      meta: {
        inputObjectName: payload.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.INTERFACE_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageInterfaceAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to interface '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to interface '${payload.name}'`,
      meta: {
        interfaceName: payload.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.OBJECT, payload)) {
    return {
      type: ChangeType.DirectiveUsageObjectAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to object '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to object '${payload.name}'`,
      meta: {
        objectName: payload.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.ENUM_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageEnumAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to enum '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to enum '${payload.name}'`,
      meta: {
        enumName: payload.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.FIELD_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageFieldDefinitionAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to field '${payload.parentType.name}.${payload.field.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to field '${payload.parentType.name}.${payload.field.name}'`,
      meta: {
        typeName: payload.parentType.name,
        fieldName: payload.field.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.parentType.name, payload.field.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.UNION_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageUnionMemberAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to union member '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to union member '${payload.name}'`,
      meta: {
        unionName: payload.name,
        addedDirectiveName: directive.name.value,
        addedUnionMemberTypeName: payload.name,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.ENUM_VALUE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageEnumValueAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to enum value '${payload.type.name}.${payload.value.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to enum value '${payload.type.name}.${payload.value.name}'`,
      meta: {
        enumName: payload.type.name,
        enumValueName: payload.value.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.type.name, payload.value.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.SCHEMA_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageSchemaAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to schema`,
      },
      message: `Directive '${directive.name.value}' was added to schema`,
      meta: {
        addedDirectiveName: directive.name.value,
        schemaTypeName: payload.getQueryType()?.name || '',
      },
      path: [payload.getQueryType()?.name || '', directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.SCALAR_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageScalarAdded,
      criticality: {
        level: addedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was added to scalar '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was added to scalar '${payload.name}'`,
      meta: {
        scalarName: payload.name,
        addedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }

  return {} as any;
}

export function directiveUsageRemoved<K extends keyof KindToPayload>(
  kind: K,
  directive: ConstDirectiveNode,
  payload: KindToPayload[K]['input'],
): Change {
  if (isOfKind(kind, Kind.ARGUMENT, payload)) {
    return {
      type: ChangeType.DirectiveUsageArgumentDefinitionRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from argument '${payload.type.name}.${payload.field.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from argument '${payload.type.name}.${payload.field.name}'`,
      meta: {
        argumentName: payload.argument.name,
        removedDirectiveName: directive.name.value,
        fieldName: payload.field.name,
        typeName: payload.type.name,
      },
      path: [
        payload.type.name,
        payload.field.name,
        payload.argument.name,
        directive.name.value,
      ].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.INPUT_VALUE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageArgumentDefinitionRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from input value '${payload.type.name}.${payload.field.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from input value '${payload.type.name}.${payload.field.name}'`,
      meta: {
        argumentName: payload.field.name,
        removedDirectiveName: directive.name.value,
        fieldName: payload.type.name,
        typeName: payload.type.name,
      },
      path: [payload.type.name, payload.field.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.INPUT_OBJECT_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageInputObjectRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from input object '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from input object '${payload.name}'`,
      meta: {
        inputObjectName: payload.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.INTERFACE_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageInterfaceRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Breaking),
        reason: `Directive '${directive.name.value}' was removed from interface '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from interface '${payload.name}'`,
      meta: {
        interfaceName: payload.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.OBJECT, payload)) {
    return {
      type: ChangeType.DirectiveUsageObjectRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from object '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from object '${payload.name}'`,
      meta: {
        objectName: payload.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.ENUM_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageEnumRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from enum '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from enum '${payload.name}'`,
      meta: {
        enumName: payload.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.FIELD_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageFieldDefinitionRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from field '${payload.parentType.name}.${payload.field.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from field '${payload.parentType.name}.${payload.field.name}'`,
      meta: {
        typeName: payload.parentType.name,
        fieldName: payload.field.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.parentType.name, payload.field.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.UNION_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageUnionMemberRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from union member '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from union member '${payload.name}'`,
      meta: {
        unionName: payload.name,
        removedDirectiveName: directive.name.value,
        removedUnionMemberTypeName: payload.name,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.ENUM_VALUE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageEnumValueRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from enum value '${payload.type.name}.${payload.value.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from enum value '${payload.type.name}.${payload.value.name}'`,
      meta: {
        enumName: payload.type.name,
        enumValueName: payload.value.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.type.name, payload.value.name, directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.SCHEMA_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageSchemaRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Dangerous),
        reason: `Directive '${directive.name.value}' was removed from schema`,
      },
      message: `Directive '${directive.name.value}' was removed from schema`,
      meta: {
        removedDirectiveName: directive.name.value,
        schemaTypeName: payload.getQueryType()?.name || '',
      },
      path: [payload.getQueryType()?.name || '', directive.name.value].join('.'),
    } as const;
  }
  if (isOfKind(kind, Kind.SCALAR_TYPE_DEFINITION, payload)) {
    return {
      type: ChangeType.DirectiveUsageScalarRemoved,
      criticality: {
        level: removedSpecialDirective(directive.name.value, CriticalityLevel.Breaking),
        reason: `Directive '${directive.name.value}' was removed from scalar '${payload.name}'`,
      },
      message: `Directive '${directive.name.value}' was removed from scalar '${payload.name}'`,
      meta: {
        scalarName: payload.name,
        removedDirectiveName: directive.name.value,
      },
      path: [payload.name, directive.name.value].join('.'),
    } as const;
  }

  return {} as any;
}

function isOfKind<K extends keyof KindToPayload>(
  kind: keyof KindToPayload,
  expectedKind: K,
  _value: any,
): _value is KindToPayload[K]['input'] {
  return kind === expectedKind;
}
