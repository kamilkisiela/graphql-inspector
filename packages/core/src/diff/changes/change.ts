export enum CriticalityLevel {
  Breaking = 'BREAKING',
  NonBreaking = 'NON_BREAKING',
  Dangerous = 'DANGEROUS',
}

export interface Criticality {
  level: CriticalityLevel;
  reason?: string;
  /** Is `true` if the criticality is safe, because of the usage determined via the `checkUsage` config option. */
  isSafeBasedOnUsage?: boolean;
}

export interface Change<TChange extends keyof Changes = any> {
  message: string;
  path?: string;
  type: TChange;
  meta: Changes[TChange]['meta'];
  criticality: Criticality;
}

const ChangeTypeConstans = {
  // Argument
  FieldArgumentDescriptionChanged: 'FIELD_ARGUMENT_DESCRIPTION_CHANGED',
  FieldArgumentDefaultChanged: 'FIELD_ARGUMENT_DEFAULT_CHANGED',
  FieldArgumentTypeChanged: 'FIELD_ARGUMENT_TYPE_CHANGED',
  // Directive
  DirectiveRemoved: 'DIRECTIVE_REMOVED',
  DirectiveAdded: 'DIRECTIVE_ADDED',
  DirectiveDescriptionChanged: 'DIRECTIVE_DESCRIPTION_CHANGED',
  DirectiveLocationAdded: 'DIRECTIVE_LOCATION_ADDED',
  DirectiveLocationRemoved: 'DIRECTIVE_LOCATION_REMOVED',
  DirectiveArgumentAdded: 'DIRECTIVE_ARGUMENT_ADDED',
  DirectiveArgumentRemoved: 'DIRECTIVE_ARGUMENT_REMOVED',
  DirectiveArgumentDescriptionChanged: 'DIRECTIVE_ARGUMENT_DESCRIPTION_CHANGED',
  DirectiveArgumentDefaultValueChanged: 'DIRECTIVE_ARGUMENT_DEFAULT_VALUE_CHANGED',
  DirectiveArgumentTypeChanged: 'DIRECTIVE_ARGUMENT_TYPE_CHANGED',
  // Enum
  EnumValueRemoved: 'ENUM_VALUE_REMOVED',
  EnumValueAdded: 'ENUM_VALUE_ADDED',
  EnumValueDescriptionChanged: 'ENUM_VALUE_DESCRIPTION_CHANGED',
  EnumValueDeprecationReasonChanged: 'ENUM_VALUE_DEPRECATION_REASON_CHANGED',
  EnumValueDeprecationReasonAdded: 'ENUM_VALUE_DEPRECATION_REASON_ADDED',
  EnumValueDeprecationReasonRemoved: 'ENUM_VALUE_DEPRECATION_REASON_REMOVED',
  // Field
  FieldRemoved: 'FIELD_REMOVED',
  FieldAdded: 'FIELD_ADDED',
  FieldDescriptionChanged: 'FIELD_DESCRIPTION_CHANGED',
  FieldDescriptionAdded: 'FIELD_DESCRIPTION_ADDED',
  FieldDescriptionRemoved: 'FIELD_DESCRIPTION_REMOVED',
  FieldDeprecationAdded: 'FIELD_DEPRECATION_ADDED',
  FieldDeprecationRemoved: 'FIELD_DEPRECATION_REMOVED',
  FieldDeprecationReasonChanged: 'FIELD_DEPRECATION_REASON_CHANGED',
  FieldDeprecationReasonAdded: 'FIELD_DEPRECATION_REASON_ADDED',
  FieldDeprecationReasonRemoved: 'FIELD_DEPRECATION_REASON_REMOVED',
  FieldTypeChanged: 'FIELD_TYPE_CHANGED',
  FieldArgumentAdded: 'FIELD_ARGUMENT_ADDED',
  FieldArgumentRemoved: 'FIELD_ARGUMENT_REMOVED',
  // Input
  InputFieldRemoved: 'INPUT_FIELD_REMOVED',
  InputFieldAdded: 'INPUT_FIELD_ADDED',
  InputFieldDescriptionAdded: 'INPUT_FIELD_DESCRIPTION_ADDED',
  InputFieldDescriptionRemoved: 'INPUT_FIELD_DESCRIPTION_REMOVED',
  InputFieldDescriptionChanged: 'INPUT_FIELD_DESCRIPTION_CHANGED',
  InputFieldDefaultValueChanged: 'INPUT_FIELD_DEFAULT_VALUE_CHANGED',
  InputFieldTypeChanged: 'INPUT_FIELD_TYPE_CHANGED',
  // Type
  ObjectTypeInterfaceAdded: 'OBJECT_TYPE_INTERFACE_ADDED',
  ObjectTypeInterfaceRemoved: 'OBJECT_TYPE_INTERFACE_REMOVED',
  // Schema
  SchemaQueryTypeChanged: 'SCHEMA_QUERY_TYPE_CHANGED',
  SchemaMutationTypeChanged: 'SCHEMA_MUTATION_TYPE_CHANGED',
  SchemaSubscriptionTypeChanged: 'SCHEMA_SUBSCRIPTION_TYPE_CHANGED',
  // Type
  TypeRemoved: 'TYPE_REMOVED',
  TypeAdded: 'TYPE_ADDED',
  TypeKindChanged: 'TYPE_KIND_CHANGED',
  TypeDescriptionChanged: 'TYPE_DESCRIPTION_CHANGED',
  // TODO
  TypeDescriptionRemoved: 'TYPE_DESCRIPTION_REMOVED',
  // TODO
  TypeDescriptionAdded: 'TYPE_DESCRIPTION_ADDED',
  // Union
  UnionMemberRemoved: 'UNION_MEMBER_REMOVED',
  UnionMemberAdded: 'UNION_MEMBER_ADDED',
  // Directive Usage
  DirectiveUsageUnionMemberAdded: 'DIRECTIVE_USAGE_UNION_MEMBER_ADDED',
  DirectiveUsageUnionMemberRemoved: 'DIRECTIVE_USAGE_UNION_MEMBER_REMOVED',
  DirectiveUsageEnumAdded: 'DIRECTIVE_USAGE_ENUM_ADDED',
  DirectiveUsageEnumRemoved: 'DIRECTIVE_USAGE_ENUM_REMOVED',
  DirectiveUsageEnumValueAdded: 'DIRECTIVE_USAGE_ENUM_VALUE_ADDED',
  DirectiveUsageEnumValueRemoved: 'DIRECTIVE_USAGE_ENUM_VALUE_REMOVED',
  DirectiveUsageInputObjectAdded: 'DIRECTIVE_USAGE_INPUT_OBJECT_ADDED',
  DirectiveUsageInputObjectRemoved: 'DIRECTIVE_USAGE_INPUT_OBJECT_REMOVED',
  DirectiveUsageFieldAdded: 'DIRECTIVE_USAGE_FIELD_ADDED',
  DirectiveUsageFieldRemoved: 'DIRECTIVE_USAGE_FIELD_REMOVED',
  DirectiveUsageScalarAdded: 'DIRECTIVE_USAGE_SCALAR_ADDED',
  DirectiveUsageScalarRemoved: 'DIRECTIVE_USAGE_SCALAR_REMOVED',
  DirectiveUsageObjectAdded: 'DIRECTIVE_USAGE_OBJECT_ADDED',
  DirectiveUsageObjectRemoved: 'DIRECTIVE_USAGE_OBJECT_REMOVED',
  DirectiveUsageInterfaceAdded: 'DIRECTIVE_USAGE_INTERFACE_ADDED',
  DirectiveUsageInterfaceRemoved: 'DIRECTIVE_USAGE_INTERFACE_REMOVED',
  DirectiveUsageArgumentDefinitionAdded: 'DIRECTIVE_USAGE_ARGUMENT_DEFINITION_ADDED',
  DirectiveUsageArgumentDefinitionRemoved: 'DIRECTIVE_USAGE_ARGUMENT_DEFINITION_REMOVED',
  DirectiveUsageSchemaAdded: 'DIRECTIVE_USAGE_SCHEMA_ADDED',
  DirectiveUsageSchemaRemoved: 'DIRECTIVE_USAGE_SCHEMA_REMOVED',
  DirectiveUsageFieldDefinitionAdded: 'DIRECTIVE_USAGE_FIELD_DEFINITION_ADDED',
  DirectiveUsageFieldDefinitionRemoved: 'DIRECTIVE_USAGE_FIELD_DEFINITION_REMOVED',
  DirectiveUsageInputFieldDefinitionAdded: 'DIRECTIVE_USAGE_INPUT_FIELD_DEFINITION_ADDED',
  DirectiveUsageInputFieldDefinitionRemoved: 'DIRECTIVE_USAGE_INPUT_FIELD_DEFINITION_REMOVED',
} as const;

export type ChangeType = (typeof ChangeTypeConstans)[keyof typeof ChangeTypeConstans];

// Directive

export type FieldArgumentDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.FieldArgumentDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldDescription: string | null;
    newDescription: string | null;
  };
};

export type FieldArgumentDefaultChangedChange = {
  type: typeof ChangeTypeConstans.FieldArgumentDefaultChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldDefaultValue?: string;
    newDefaultValue?: string;
  };
};

export type FieldArgumentTypeChangedChange = {
  type: typeof ChangeTypeConstans.FieldArgumentTypeChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldArgumentType: string;
    newArgumentType: string;
    isSafeArgumentTypeChange: boolean;
  };
};

export type DirectiveRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveRemoved;
  meta: {
    removedDirectiveName: string;
  };
};

export type DirectiveAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveAdded;
  meta: {
    addedDirectiveName: string;
  };
};

export type DirectiveDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.DirectiveDescriptionChanged;
  meta: {
    directiveName: string;
    oldDirectiveDescription: string | null;
    newDirectiveDescription: string | null;
  };
};

export type DirectiveLocationAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveLocationAdded;
  meta: {
    directiveName: string;
    addedDirectiveLocation: string;
  };
};

export type DirectiveLocationRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveLocationRemoved;
  meta: {
    directiveName: string;
    removedDirectiveLocation: string;
  };
};

export type DirectiveArgumentAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveArgumentAdded;
  meta: {
    directiveName: string;
    addedDirectiveArgumentName: string;
    addedDirectiveArgumentTypeIsNonNull: boolean;
  };
};

export type DirectiveArgumentRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveArgumentRemoved;
  meta: {
    directiveName: string;
    removedDirectiveArgumentName: string;
  };
};

export type DirectiveArgumentDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.DirectiveArgumentDescriptionChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentDescription: string | null;
    newDirectiveArgumentDescription: string | null;
  };
};

export type DirectiveArgumentDefaultValueChangedChange = {
  type: typeof ChangeTypeConstans.DirectiveArgumentDefaultValueChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentDefaultValue?: string /* | null */;
    newDirectiveArgumentDefaultValue?: string /* | null */;
  };
};

export type DirectiveArgumentTypeChangedChange = {
  type: typeof ChangeTypeConstans.DirectiveArgumentTypeChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentType: string;
    newDirectiveArgumentType: string;
    /** Note: this could also be computed from oldDirectiveArgumentType and newDirectiveArgumentType */
    isSafeDirectiveArgumentTypeChange: boolean;
  };
};

// Enum

export type EnumValueRemovedChange = {
  type: typeof ChangeTypeConstans.EnumValueRemoved;
  meta: {
    enumName: string;
    removedEnumValueName: string;
    isEnumValueDeprecated: boolean;
  };
};

export type EnumValueAddedChange = {
  type: typeof ChangeTypeConstans.EnumValueAdded;
  meta: {
    enumName: string;
    addedEnumValueName: string;
  };
};

export type EnumValueDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.EnumValueDescriptionChanged;
  meta: {
    enumName: string;
    enumValueName: string;
    oldEnumValueDescription: string | null;
    newEnumValueDescription: string | null;
  };
};

export type EnumValueDeprecationReasonChangedChange = {
  type: typeof ChangeTypeConstans.EnumValueDeprecationReasonChanged;
  meta: {
    enumName: string;
    enumValueName: string;
    oldEnumValueDeprecationReason: string;
    newEnumValueDeprecationReason: string;
  };
};

export type EnumValueDeprecationReasonAddedChange = {
  type: typeof ChangeTypeConstans.EnumValueDeprecationReasonAdded;
  meta: {
    enumName: string;
    enumValueName: string;
    addedValueDeprecationReason: string;
  };
};

export type EnumValueDeprecationReasonRemovedChange = {
  type: typeof ChangeTypeConstans.EnumValueDeprecationReasonRemoved;
  meta: {
    enumName: string;
    enumValueName: string;
    removedEnumValueDeprecationReason: string;
  };
};

// Field

export type FieldRemovedChange = {
  type: typeof ChangeTypeConstans.FieldRemoved;
  meta: {
    typeName: string;
    removedFieldName: string;
    isRemovedFieldDeprecated: boolean;
    typeType: string;
  };
};

export type FieldAddedChange = {
  type: typeof ChangeTypeConstans.FieldAdded;
  meta: {
    typeName: string;
    addedFieldName: string;
    typeType: string;
  };
};

export type FieldDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.FieldDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDescription: string;
    newDescription: string;
  };
};

export type FieldDescriptionAddedChange = {
  type: typeof ChangeTypeConstans.FieldDescriptionAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDescription: string;
  };
};

export type FieldDescriptionRemovedChange = {
  type: typeof ChangeTypeConstans.FieldDescriptionRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationAddedChange = {
  type: typeof ChangeTypeConstans.FieldDeprecationAdded;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationRemovedChange = {
  type: typeof ChangeTypeConstans.FieldDeprecationRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationReasonChangedChange = {
  type: typeof ChangeTypeConstans.FieldDeprecationReasonChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDeprecationReason: string;
    newDeprecationReason: string;
  };
};

export type FieldDeprecationReasonAddedChange = {
  type: typeof ChangeTypeConstans.FieldDeprecationReasonAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDeprecationReason: string;
  };
};

export type FieldDeprecationReasonRemovedChange = {
  type: typeof ChangeTypeConstans.FieldDeprecationReasonRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldTypeChangedChange = {
  type: typeof ChangeTypeConstans.FieldTypeChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldFieldType: string;
    newFieldType: string;
    isSafeFieldTypeChange: boolean;
  };
};

export type DirectiveUsageUnionMemberAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageUnionMemberAdded;
  meta: {
    unionName: string;
    addedUnionMemberTypeName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageUnionMemberRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageUnionMemberRemoved;
  meta: {
    unionName: string;
    removedUnionMemberTypeName: string;
    removedDirectiveName: string;
  };
};

export type FieldArgumentAddedChange = {
  type: typeof ChangeTypeConstans.FieldArgumentAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedArgumentName: string;
    addedArgumentType: string;
    hasDefaultValue: boolean;
    isAddedFieldArgumentBreaking: boolean;
  };
};

export type FieldArgumentRemovedChange = {
  type: typeof ChangeTypeConstans.FieldArgumentRemoved;
  meta: {
    typeName: string;
    fieldName: string;
    removedFieldArgumentName: string;
    removedFieldType: string;
  };
};

// Input

export type InputFieldRemovedChange = {
  type: typeof ChangeTypeConstans.InputFieldRemoved;
  meta: {
    inputName: string;
    removedFieldName: string;
    isInputFieldDeprecated: boolean;
  };
};

export type InputFieldAddedChange = {
  type: typeof ChangeTypeConstans.InputFieldAdded;
  meta: {
    inputName: string;
    addedInputFieldName: string;
    isAddedInputFieldTypeNullable: boolean;
    addedInputFieldType: string;
  };
};

export type InputFieldDescriptionAddedChange = {
  type: typeof ChangeTypeConstans.InputFieldDescriptionAdded;
  meta: {
    inputName: string;
    inputFieldName: string;
    addedInputFieldDescription: string;
  };
};

export type InputFieldDescriptionRemovedChange = {
  type: typeof ChangeTypeConstans.InputFieldDescriptionRemoved;
  meta: {
    inputName: string;
    inputFieldName: string;
    removedDescription: string;
  };
};

export type InputFieldDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.InputFieldDescriptionChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldInputFieldDescription: string;
    newInputFieldDescription: string;
  };
};

export type InputFieldDefaultValueChangedChange = {
  type: typeof ChangeTypeConstans.InputFieldDefaultValueChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldDefaultValue?: string /* null | */;
    newDefaultValue?: string /* null | */;
  };
};

export type InputFieldTypeChangedChange = {
  type: typeof ChangeTypeConstans.InputFieldTypeChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldInputFieldType: string;
    newInputFieldType: string;
    isInputFieldTypeChangeSafe: boolean;
  };
};

// Type

export type ObjectTypeInterfaceAddedChange = {
  type: typeof ChangeTypeConstans.ObjectTypeInterfaceAdded;
  meta: {
    objectTypeName: string;
    addedInterfaceName: string;
  };
};

export type ObjectTypeInterfaceRemovedChange = {
  type: typeof ChangeTypeConstans.ObjectTypeInterfaceRemoved;
  meta: {
    objectTypeName: string;
    removedInterfaceName: string;
  };
};

// Schema

export type SchemaQueryTypeChangedChange = {
  type: typeof ChangeTypeConstans.SchemaQueryTypeChanged;
  meta: {
    oldQueryTypeName: string;
    newQueryTypeName: string;
  };
};

export type SchemaMutationTypeChangedChange = {
  type: typeof ChangeTypeConstans.SchemaMutationTypeChanged;
  meta: {
    oldMutationTypeName: string;
    newMutationTypeName: string;
  };
};

export type SchemaSubscriptionTypeChangedChange = {
  type: typeof ChangeTypeConstans.SchemaSubscriptionTypeChanged;
  meta: {
    oldSubscriptionTypeName: string;
    newSubscriptionTypeName: string;
  };
};

// Type

export type TypeRemovedChange = {
  type: typeof ChangeTypeConstans.TypeRemoved;
  meta: {
    removedTypeName: string;
  };
};

export type TypeAddedChange = {
  type: typeof ChangeTypeConstans.TypeAdded;
  meta: {
    addedTypeName: string;
  };
};

export type TypeKindChangedChange = {
  type: typeof ChangeTypeConstans.TypeKindChanged;
  meta: {
    typeName: string;
    oldTypeKind: string;
    newTypeKind: string;
  };
};

export type TypeDescriptionChangedChange = {
  type: typeof ChangeTypeConstans.TypeDescriptionChanged;
  meta: {
    typeName: string;
    oldTypeDescription: string;
    newTypeDescription: string;
  };
};

export type TypeDescriptionAddedChange = {
  type: typeof ChangeTypeConstans.TypeDescriptionAdded;
  meta: {
    typeName: string;
    addedTypeDescription: string;
  };
};

export type TypeDescriptionRemovedChange = {
  type: typeof ChangeTypeConstans.TypeDescriptionRemoved;
  meta: {
    typeName: string;
    removedTypeDescription: string;
  };
};

// Union

export type UnionMemberRemovedChange = {
  type: typeof ChangeTypeConstans.UnionMemberRemoved;
  meta: {
    unionName: string;
    removedUnionMemberTypeName: string;
  };
};

export type UnionMemberAddedChange = {
  type: typeof ChangeTypeConstans.UnionMemberAdded;
  meta: {
    unionName: string;
    addedUnionMemberTypeName: string;
  };
};

// Directive Usage

export type DirectiveUsageEnumAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageEnumAdded;
  meta: {
    enumName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageEnumRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageEnumRemoved;
  meta: {
    enumName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageEnumValueAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageEnumValueAdded;
  meta: {
    enumName: string;
    enumValueName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageEnumValueRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageEnumValueRemoved;
  meta: {
    enumName: string;
    enumValueName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageInputObjectdRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageInputObjectRemoved;
  meta: {
    inputObjectName: string;
    removedInputFieldName: string;
    isRemovedInputFieldTypeNullable: boolean;
    removedInputFieldType: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageInputObjectAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageInputObjectAdded;
  meta: {
    inputObjectName: string;
    addedInputFieldName: string;
    isAddedInputFieldTypeNullable: boolean;
    addedInputFieldType: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageInputFieldDefinitionAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageInputFieldDefinitionAdded;
  meta: {
    inputObjectName: string;
    inputFieldName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageInputFieldDefinitionRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageInputFieldDefinitionRemoved;
  meta: {
    inputObjectName: string;
    inputFieldName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageFieldAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageFieldAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageFieldRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageFieldRemoved;
  meta: {
    typeName: string;
    fieldName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageScalarAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageScalarAdded;
  meta: {
    scalarName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageScalarRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageScalarRemoved;
  meta: {
    scalarName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageObjectAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageObjectAdded;
  meta: {
    objectName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageObjectRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageObjectRemoved;
  meta: {
    objectName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageInterfaceAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageInterfaceAdded;
  meta: {
    interfaceName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageSchemaAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageSchemaAdded;
  meta: {
    addedDirectiveName: string;
    schemaTypeName: string;
  };
};

export type DirectiveUsageSchemaRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageSchemaRemoved;
  meta: {
    removedDirectiveName: string;
    schemaTypeName: string;
  };
};

export type DirectiveUsageFieldDefinitionAddedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageFieldDefinitionAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageFieldDefinitionRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageFieldDefinitionRemoved;
  meta: {
    typeName: string;
    fieldName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageArgumentDefinitionChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageArgumentDefinitionAdded;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    addedDirectiveName: string;
  };
};

export type DirectiveUsageArgumentDefinitionRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageArgumentDefinitionRemoved;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    removedDirectiveName: string;
  };
};

export type DirectiveUsageInterfaceRemovedChange = {
  type: typeof ChangeTypeConstans.DirectiveUsageInterfaceRemoved;
  meta: {
    interfaceName: string;
    removedDirectiveName: string;
  };
};
type Changes = {
  [ChangeTypeConstans.TypeAdded]: TypeAddedChange;
  [ChangeTypeConstans.TypeRemoved]: TypeRemovedChange;
  [ChangeTypeConstans.TypeKindChanged]: TypeKindChangedChange;
  [ChangeTypeConstans.TypeDescriptionChanged]: TypeDescriptionChangedChange;
  [ChangeTypeConstans.TypeDescriptionAdded]: TypeDescriptionAddedChange;
  [ChangeTypeConstans.TypeDescriptionRemoved]: TypeDescriptionRemovedChange;
  [ChangeTypeConstans.UnionMemberRemoved]: UnionMemberRemovedChange;
  [ChangeTypeConstans.UnionMemberAdded]: UnionMemberAddedChange;
  [ChangeTypeConstans.SchemaQueryTypeChanged]: SchemaQueryTypeChangedChange;
  [ChangeTypeConstans.SchemaMutationTypeChanged]: SchemaMutationTypeChangedChange;
  [ChangeTypeConstans.SchemaSubscriptionTypeChanged]: SchemaSubscriptionTypeChangedChange;
  [ChangeTypeConstans.ObjectTypeInterfaceAdded]: ObjectTypeInterfaceAddedChange;
  [ChangeTypeConstans.ObjectTypeInterfaceRemoved]: ObjectTypeInterfaceRemovedChange;
  [ChangeTypeConstans.InputFieldRemoved]: InputFieldRemovedChange;
  [ChangeTypeConstans.InputFieldAdded]: InputFieldAddedChange;
  [ChangeTypeConstans.InputFieldDescriptionAdded]: InputFieldDescriptionAddedChange;
  [ChangeTypeConstans.InputFieldDescriptionRemoved]: InputFieldDescriptionRemovedChange;
  [ChangeTypeConstans.InputFieldDescriptionChanged]: InputFieldDescriptionChangedChange;
  [ChangeTypeConstans.InputFieldDefaultValueChanged]: InputFieldDefaultValueChangedChange;
  [ChangeTypeConstans.InputFieldTypeChanged]: InputFieldTypeChangedChange;
  [ChangeTypeConstans.FieldRemoved]: FieldRemovedChange;
  [ChangeTypeConstans.FieldAdded]: FieldAddedChange;
  [ChangeTypeConstans.FieldDescriptionAdded]: FieldDescriptionAddedChange;
  [ChangeTypeConstans.FieldDescriptionRemoved]: FieldDescriptionRemovedChange;
  [ChangeTypeConstans.FieldDescriptionChanged]: FieldDescriptionChangedChange;
  [ChangeTypeConstans.FieldArgumentAdded]: FieldArgumentAddedChange;
  [ChangeTypeConstans.FieldArgumentRemoved]: FieldArgumentRemovedChange;
  [ChangeTypeConstans.InputFieldRemoved]: InputFieldRemovedChange;
  [ChangeTypeConstans.InputFieldAdded]: InputFieldAddedChange;
  [ChangeTypeConstans.InputFieldDescriptionAdded]: InputFieldDescriptionAddedChange;
  [ChangeTypeConstans.InputFieldDescriptionRemoved]: InputFieldDescriptionRemovedChange;
  [ChangeTypeConstans.InputFieldDescriptionChanged]: InputFieldDescriptionChangedChange;
  [ChangeTypeConstans.InputFieldDefaultValueChanged]: InputFieldDefaultValueChangedChange;
  [ChangeTypeConstans.InputFieldTypeChanged]: InputFieldTypeChangedChange;
  [ChangeTypeConstans.ObjectTypeInterfaceAdded]: ObjectTypeInterfaceAddedChange;
  [ChangeTypeConstans.ObjectTypeInterfaceRemoved]: ObjectTypeInterfaceRemovedChange;
  [ChangeTypeConstans.SchemaQueryTypeChanged]: SchemaQueryTypeChangedChange;
  [ChangeTypeConstans.SchemaMutationTypeChanged]: SchemaMutationTypeChangedChange;
  [ChangeTypeConstans.SchemaSubscriptionTypeChanged]: SchemaSubscriptionTypeChangedChange;
  [ChangeTypeConstans.TypeAdded]: TypeAddedChange;
  [ChangeTypeConstans.TypeRemoved]: TypeRemovedChange;
  [ChangeTypeConstans.TypeKindChanged]: TypeKindChangedChange;
  [ChangeTypeConstans.TypeDescriptionChanged]: TypeDescriptionChangedChange;
  [ChangeTypeConstans.TypeDescriptionRemoved]: TypeDescriptionRemovedChange;
  [ChangeTypeConstans.TypeDescriptionAdded]: TypeDescriptionAddedChange;
  [ChangeTypeConstans.UnionMemberAdded]: UnionMemberAddedChange;
  [ChangeTypeConstans.UnionMemberRemoved]: UnionMemberRemovedChange;
  [ChangeTypeConstans.DirectiveRemoved]: DirectiveRemovedChange;
  [ChangeTypeConstans.DirectiveAdded]: DirectiveAddedChange;
  [ChangeTypeConstans.DirectiveArgumentAdded]: DirectiveArgumentAddedChange;
  [ChangeTypeConstans.DirectiveArgumentRemoved]: DirectiveArgumentRemovedChange;
  [ChangeTypeConstans.DirectiveArgumentDescriptionChanged]: DirectiveArgumentDescriptionChangedChange;
  [ChangeTypeConstans.DirectiveArgumentDefaultValueChanged]: DirectiveArgumentDefaultValueChangedChange;
  [ChangeTypeConstans.DirectiveArgumentTypeChanged]: DirectiveArgumentTypeChangedChange;
  [ChangeTypeConstans.DirectiveDescriptionChanged]: DirectiveDescriptionChangedChange;
  [ChangeTypeConstans.FieldArgumentDescriptionChanged]: FieldArgumentDescriptionChangedChange;
  [ChangeTypeConstans.FieldArgumentDefaultChanged]: FieldArgumentDefaultChangedChange;
  [ChangeTypeConstans.FieldArgumentTypeChanged]: FieldArgumentTypeChangedChange;
  [ChangeTypeConstans.DirectiveLocationAdded]: DirectiveLocationAddedChange;
  [ChangeTypeConstans.DirectiveLocationRemoved]: DirectiveLocationRemovedChange;
  [ChangeTypeConstans.EnumValueRemoved]: EnumValueRemovedChange;
  [ChangeTypeConstans.EnumValueDescriptionChanged]: EnumValueDescriptionChangedChange;
  [ChangeTypeConstans.EnumValueDeprecationReasonChanged]: EnumValueDeprecationReasonChangedChange;
  [ChangeTypeConstans.EnumValueDeprecationReasonAdded]: EnumValueDeprecationReasonAddedChange;
  [ChangeTypeConstans.EnumValueDeprecationReasonRemoved]: EnumValueDeprecationReasonRemovedChange;
  [ChangeTypeConstans.EnumValueAdded]: EnumValueAddedChange;
  [ChangeTypeConstans.FieldDeprecationAdded]: FieldDeprecationAddedChange;
  [ChangeTypeConstans.FieldDeprecationRemoved]: FieldDeprecationRemovedChange;
  [ChangeTypeConstans.FieldDeprecationReasonChanged]: FieldDeprecationReasonChangedChange;
  [ChangeTypeConstans.FieldDeprecationReasonAdded]: FieldDeprecationReasonAddedChange;
  [ChangeTypeConstans.FieldDeprecationReasonRemoved]: FieldDeprecationReasonRemovedChange;
  [ChangeTypeConstans.FieldTypeChanged]: FieldTypeChangedChange;
  [ChangeTypeConstans.DirectiveUsageUnionMemberAdded]: DirectiveUsageUnionMemberAddedChange;
  [ChangeTypeConstans.DirectiveUsageUnionMemberRemoved]: DirectiveUsageUnionMemberRemovedChange;
  [ChangeTypeConstans.DirectiveUsageEnumAdded]: DirectiveUsageEnumAddedChange;
  [ChangeTypeConstans.DirectiveUsageEnumRemoved]: DirectiveUsageEnumRemovedChange;
  [ChangeTypeConstans.DirectiveUsageEnumValueAdded]: DirectiveUsageEnumValueAddedChange;
  [ChangeTypeConstans.DirectiveUsageEnumValueRemoved]: DirectiveUsageEnumValueRemovedChange;
  [ChangeTypeConstans.DirectiveUsageInputObjectAdded]: DirectiveUsageInputObjectAddedChange;
  [ChangeTypeConstans.DirectiveUsageInputObjectRemoved]: DirectiveUsageInputObjectdRemovedChange;
  [ChangeTypeConstans.DirectiveUsageFieldAdded]: DirectiveUsageFieldAddedChange;
  [ChangeTypeConstans.DirectiveUsageFieldRemoved]: DirectiveUsageFieldRemovedChange;
  [ChangeTypeConstans.DirectiveUsageScalarAdded]: DirectiveUsageScalarAddedChange;
  [ChangeTypeConstans.DirectiveUsageScalarRemoved]: DirectiveUsageScalarRemovedChange;
  [ChangeTypeConstans.DirectiveUsageObjectAdded]: DirectiveUsageObjectAddedChange;
  [ChangeTypeConstans.DirectiveUsageObjectRemoved]: DirectiveUsageObjectRemovedChange;
  [ChangeTypeConstans.DirectiveUsageInterfaceAdded]: DirectiveUsageInterfaceAddedChange;
  [ChangeTypeConstans.DirectiveUsageInterfaceRemoved]: DirectiveUsageInterfaceRemovedChange;
  [ChangeTypeConstans.DirectiveUsageArgumentDefinitionAdded]: DirectiveUsageArgumentDefinitionChange;
  [ChangeTypeConstans.DirectiveUsageArgumentDefinitionRemoved]: DirectiveUsageArgumentDefinitionRemovedChange;
  [ChangeTypeConstans.DirectiveUsageSchemaAdded]: DirectiveUsageSchemaAddedChange;
  [ChangeTypeConstans.DirectiveUsageSchemaRemoved]: DirectiveUsageSchemaRemovedChange;
  [ChangeTypeConstans.DirectiveUsageFieldDefinitionAdded]: DirectiveUsageFieldDefinitionAddedChange;
  [ChangeTypeConstans.DirectiveUsageFieldDefinitionRemoved]: DirectiveUsageFieldDefinitionRemovedChange;
};

export type SerializableChange = Changes[keyof Changes];
