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
  DirectiveUsageInputObjectRemovedChange,
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
    change: DirectiveUsageInputObjectAddedChange | DirectiveUsageInputObjectRemovedChange;
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
    return directiveUsageArgumentDefinitionAddedFromMeta({
      type: ChangeType.DirectiveUsageArgumentDefinitionAdded,
      meta: {
        argumentName: payload.argument.name,
        addedDirectiveName: directive.name.value,
        fieldName: payload.field.name,
        typeName: payload.type.name,
      },
    });
  }
  if (isOfKind(kind, Kind.INPUT_VALUE_DEFINITION, payload)) {
    return directiveUsageArgumentDefinitionAddedFromMeta({
      type: ChangeType.DirectiveUsageArgumentDefinitionAdded,
      meta: {
        argumentName: payload.field.name,
        addedDirectiveName: directive.name.value,
        fieldName: payload.type.name,
        typeName: payload.type.name,
      },
    });
  }
  if (isOfKind(kind, Kind.INPUT_OBJECT_TYPE_DEFINITION, payload)) {
    return directiveUsageInputObjectAddedFromMeta({
      type: ChangeType.DirectiveUsageInputObjectAdded,
      meta: {
        inputObjectName: payload.name,
        addedDirectiveName: directive.name.value,
        isAddedInputFieldTypeNullable: false,
        addedInputFieldName: '',
        addedInputFieldType: '',
      },
    });
  }
  if (isOfKind(kind, Kind.INTERFACE_TYPE_DEFINITION, payload)) {
    return directiveUsageInterfaceAddedFromMeta({
      type: ChangeType.DirectiveUsageInterfaceAdded,
      meta: {
        interfaceName: payload.name,
        addedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.OBJECT, payload)) {
    return directiveUsageObjectAddedFromMeta({
      type: ChangeType.DirectiveUsageObjectAdded,
      meta: {
        objectName: payload.name,
        addedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.ENUM_TYPE_DEFINITION, payload)) {
    return directiveUsageEnumAddedFromMeta({
      type: ChangeType.DirectiveUsageEnumAdded,
      meta: {
        enumName: payload.name,
        addedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.FIELD_DEFINITION, payload)) {
    return directiveUsageFieldDefinitionAddedFromMeta({
      type: ChangeType.DirectiveUsageFieldDefinitionAdded,
      meta: {
        addedDirectiveName: directive.name.value,
        fieldName: payload.field.name,
        typeName: payload.parentType.name,
      },
    });
  }
  if (isOfKind(kind, Kind.UNION_TYPE_DEFINITION, payload)) {
    return directiveUsageUnionMemberAddedFromMeta({
      type: ChangeType.DirectiveUsageUnionMemberAdded,
      meta: {
        unionName: payload.name,
        addedDirectiveName: directive.name.value,
        addedUnionMemberTypeName: payload.name,
      },
    });
  }
  if (isOfKind(kind, Kind.ENUM_VALUE_DEFINITION, payload)) {
    return directiveUsageEnumValueAddedFromMeta({
      type: ChangeType.DirectiveUsageEnumValueAdded,
      meta: {
        enumName: payload.type.name,
        enumValueName: payload.value.name,
        addedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.SCHEMA_DEFINITION, payload)) {
    return directiveUsageSchemaAddedFromMeta({
      type: ChangeType.DirectiveUsageSchemaAdded,
      meta: {
        addedDirectiveName: directive.name.value,
        schemaTypeName: payload.getQueryType()?.name || '',
      },
    });
  }
  if (isOfKind(kind, Kind.SCALAR_TYPE_DEFINITION, payload)) {
    return directiveUsageScalarAddedFromMeta({
      type: ChangeType.DirectiveUsageScalarAdded,
      meta: {
        scalarName: payload.name,
        addedDirectiveName: directive.name.value,
      },
    });
  }

  return {} as any;
}

export function directiveUsageRemoved<K extends keyof KindToPayload>(
  kind: K,
  directive: ConstDirectiveNode,
  payload: KindToPayload[K]['input'],
): Change {
  if (isOfKind(kind, Kind.ARGUMENT, payload)) {
    return directiveUsageArgumentDefinitionRemovedFromMeta({
      type: ChangeType.DirectiveUsageArgumentDefinitionRemoved,
      meta: {
        argumentName: payload.argument.name,
        removedDirectiveName: directive.name.value,
        fieldName: payload.field.name,
        typeName: payload.type.name,
      },
    });
  }
  if (isOfKind(kind, Kind.INPUT_VALUE_DEFINITION, payload)) {
    return directiveUsageArgumentDefinitionRemovedFromMeta({
      type: ChangeType.DirectiveUsageArgumentDefinitionRemoved,
      meta: {
        argumentName: payload.field.name,
        removedDirectiveName: directive.name.value,
        fieldName: payload.type.name,
        typeName: payload.type.name,
      },
    });
  }
  if (isOfKind(kind, Kind.INPUT_OBJECT_TYPE_DEFINITION, payload)) {
    return directiveUsageInputObjectRemovedFromMeta({
      type: ChangeType.DirectiveUsageInputObjectRemoved,
      meta: {
        inputObjectName: payload.name,
        removedDirectiveName: directive.name.value,
        isRemovedInputFieldTypeNullable: false,
        removedInputFieldName: '',
        removedInputFieldType: '',
      },
    });
  }
  if (isOfKind(kind, Kind.INTERFACE_TYPE_DEFINITION, payload)) {
    return directiveUsageInterfaceRemovedFromMeta({
      type: ChangeType.DirectiveUsageInterfaceRemoved,
      meta: {
        interfaceName: payload.name,
        removedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.OBJECT, payload)) {
    return directiveUsageObjectRemovedFromMeta({
      type: ChangeType.DirectiveUsageObjectRemoved,
      meta: {
        objectName: payload.name,
        removedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.ENUM_TYPE_DEFINITION, payload)) {
    return directiveUsageEnumRemovedFromMeta({
      type: ChangeType.DirectiveUsageEnumRemoved,
      meta: {
        enumName: payload.name,
        removedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.FIELD_DEFINITION, payload)) {
    return directiveUsageFieldDefinitionRemovedFromMeta({
      type: ChangeType.DirectiveUsageFieldDefinitionRemoved,
      meta: {
        removedDirectiveName: directive.name.value,
        fieldName: payload.field.name,
        typeName: payload.parentType.name,
      },
    });
  }
  if (isOfKind(kind, Kind.UNION_TYPE_DEFINITION, payload)) {
    return directiveUsageUnionMemberRemovedFromMeta({
      type: ChangeType.DirectiveUsageUnionMemberRemoved,
      meta: {
        unionName: payload.name,
        removedDirectiveName: directive.name.value,
        removedUnionMemberTypeName: payload.name,
      },
    });
  }
  if (isOfKind(kind, Kind.ENUM_VALUE_DEFINITION, payload)) {
    return directiveUsageEnumValueRemovedFromMeta({
      type: ChangeType.DirectiveUsageEnumValueRemoved,
      meta: {
        enumName: payload.type.name,
        enumValueName: payload.value.name,
        removedDirectiveName: directive.name.value,
      },
    });
  }
  if (isOfKind(kind, Kind.SCHEMA_DEFINITION, payload)) {
    return directiveUsageSchemaRemovedFromMeta({
      type: ChangeType.DirectiveUsageSchemaRemoved,
      meta: {
        removedDirectiveName: directive.name.value,
        schemaTypeName: payload.getQueryType()?.name || '',
      },
    });
  }
  if (isOfKind(kind, Kind.SCALAR_TYPE_DEFINITION, payload)) {
    return directiveUsageScalarRemovedFromMeta({
      type: ChangeType.DirectiveUsageScalarRemoved,
      meta: {
        scalarName: payload.name,
        removedDirectiveName: directive.name.value,
      },
    });
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

// directiveUsageFieldDefinition
export function directiveUsageFieldDefinitionAddedFromMeta(
  change: DirectiveUsageFieldDefinitionAddedChange,
) {
  return {
    type: ChangeType.DirectiveUsageFieldDefinitionAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to field '${change.meta.typeName}.${change.meta.fieldName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to field '${change.meta.typeName}.${change.meta.fieldName}'`,
    meta: change.meta,
  };
}

export function directiveUsageFieldDefinitionRemovedFromMeta(
  change: DirectiveUsageFieldDefinitionRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageFieldDefinitionRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from field '${change.meta.typeName}.${change.meta.fieldName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from field '${change.meta.typeName}.${change.meta.fieldName}'`,
    meta: change.meta,
  };
}

// directiveUsageArgumentDefinition
export function directiveUsageArgumentDefinitionAddedFromMeta(
  change: DirectiveUsageArgumentDefinitionChange,
) {
  return {
    type: ChangeType.DirectiveUsageArgumentDefinitionAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    meta: change.meta,
  };
}

export function directiveUsageArgumentDefinitionRemovedFromMeta(
  change: DirectiveUsageArgumentDefinitionRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageArgumentDefinitionRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    meta: change.meta,
  };
}

// directiveUsageEnum
export function directiveUsageEnumAddedFromMeta(change: DirectiveUsageEnumAddedChange) {
  return {
    type: ChangeType.DirectiveUsageEnumAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to enum '${change.meta.enumName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to enum '${change.meta.enumName}'`,
    meta: change.meta,
  };
}

export function directiveUsageEnumRemovedFromMeta(change: DirectiveUsageEnumRemovedChange) {
  return {
    type: ChangeType.DirectiveUsageEnumRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from enum '${change.meta.enumName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from enum '${change.meta.enumName}'`,
    meta: change.meta,
  };
}

// directiveUsageEnumValue
export function directiveUsageEnumValueAddedFromMeta(change: DirectiveUsageEnumValueAddedChange) {
  return {
    type: ChangeType.DirectiveUsageEnumValueAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to enum value '${change.meta.enumName}.${change.meta.enumValueName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to enum value '${change.meta.enumName}.${change.meta.enumValueName}'`,
    meta: change.meta,
  };
}

export function directiveUsageEnumValueRemovedFromMeta(
  change: DirectiveUsageEnumValueRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageEnumValueRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from enum value '${change.meta.enumName}.${change.meta.enumValueName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from enum value '${change.meta.enumName}.${change.meta.enumValueName}'`,
    meta: change.meta,
  };
}

// directiveUsageInputObject
export function directiveUsageInputObjectAddedFromMeta(
  change: DirectiveUsageInputObjectAddedChange,
) {
  return {
    type: ChangeType.DirectiveUsageInputObjectAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to input object '${change.meta.inputObjectName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to input object '${change.meta.inputObjectName}'`,
    meta: change.meta,
  };
}

export function directiveUsageInputObjectRemovedFromMeta(
  change: DirectiveUsageInputObjectRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageInputObjectRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from input object '${change.meta.inputObjectName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from input object '${change.meta.inputObjectName}'`,
    meta: change.meta,
  };
}

// directiveUsageInterface
export function directiveUsageInterfaceAddedFromMeta(change: DirectiveUsageInterfaceAddedChange) {
  return {
    type: ChangeType.DirectiveUsageInterfaceAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to interface '${change.meta.interfaceName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to interface '${change.meta.interfaceName}'`,
    meta: change.meta,
  };
}

export function directiveUsageInterfaceRemovedFromMeta(
  change: DirectiveUsageInterfaceRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageInterfaceRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Breaking),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from interface '${change.meta.interfaceName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from interface '${change.meta.interfaceName}'`,
    meta: change.meta,
  };
}

// directiveUsageObject
export function directiveUsageObjectAddedFromMeta(change: DirectiveUsageObjectAddedChange) {
  return {
    type: ChangeType.DirectiveUsageObjectAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to object '${change.meta.objectName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to object '${change.meta.objectName}'`,
    meta: change.meta,
  };
}

export function directiveUsageObjectRemovedFromMeta(change: DirectiveUsageObjectRemovedChange) {
  return {
    type: ChangeType.DirectiveUsageObjectRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Breaking),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from object '${change.meta.objectName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from object '${change.meta.objectName}'`,
    meta: change.meta,
  };
}

// directiveUsageScalar
export function directiveUsageScalarAddedFromMeta(change: DirectiveUsageScalarAddedChange) {
  return {
    type: ChangeType.DirectiveUsageScalarAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to scalar '${change.meta.scalarName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to scalar '${change.meta.scalarName}'`,
    meta: change.meta,
  };
}

export function directiveUsageScalarRemovedFromMeta(change: DirectiveUsageScalarRemovedChange) {
  return {
    type: ChangeType.DirectiveUsageScalarRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Breaking),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from scalar '${change.meta.scalarName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from scalar '${change.meta.scalarName}'`,
    meta: change.meta,
  };
}

// directiveUsageSchema
export function directiveUsageSchemaAddedFromMeta(change: DirectiveUsageSchemaAddedChange) {
  return {
    type: ChangeType.DirectiveUsageSchemaAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to schema`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to schema`,
    meta: change.meta,
  };
}

export function directiveUsageSchemaRemovedFromMeta(change: DirectiveUsageSchemaRemovedChange) {
  return {
    type: ChangeType.DirectiveUsageSchemaRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Breaking),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from schema`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from schema`,
    meta: change.meta,
  };
}

// directiveUsageUnionMember
export function directiveUsageUnionMemberAddedFromMeta(
  change: DirectiveUsageUnionMemberAddedChange,
) {
  return {
    type: ChangeType.DirectiveUsageUnionMemberAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to union member '${change.meta.unionName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to union member '${change.meta.unionName}'`,
    meta: change.meta,
  };
}

export function directiveUsageUnionMemberRemovedFromMeta(
  change: DirectiveUsageUnionMemberRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageUnionMemberRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Breaking),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from union member '${change.meta.unionName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from union member '${change.meta.unionName}'`,
    meta: change.meta,
  };
}

// DirectiveUsageArgumentDefinition
export function directiveUsageArgumentInputValueDefinitionAddedFromMeta(
  change: DirectiveUsageArgumentDefinitionChange,
) {
  return {
    type: ChangeType.DirectiveUsageArgumentDefinitionAdded,
    criticality: {
      level: addedSpecialDirective(change.meta.addedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.addedDirectiveName}' was added to argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    },
    message: `Directive '${change.meta.addedDirectiveName}' was added to argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    meta: change.meta,
  };
}

export function directiveUsageArgumentInputValueDefinitionRemovedFromMeta(
  change: DirectiveUsageArgumentDefinitionRemovedChange,
) {
  return {
    type: ChangeType.DirectiveUsageArgumentDefinitionRemoved,
    criticality: {
      level: removedSpecialDirective(change.meta.removedDirectiveName, CriticalityLevel.Dangerous),
      reason: `Directive '${change.meta.removedDirectiveName}' was removed from argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    },
    message: `Directive '${change.meta.removedDirectiveName}' was removed from argument '${change.meta.typeName}.${change.meta.fieldName}.${change.meta.argumentName}'`,
    meta: change.meta,
  };
}
