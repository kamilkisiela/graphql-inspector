export enum ChangeType {
  // Argument
  FieldArgumentDescriptionChanged = 'FIELD_ARGUMENT_DESCRIPTION_CHANGED',
  FieldArgumentDefaultChanged = 'FIELD_ARGUMENT_DEFAULT_CHANGED',
  FieldArgumentTypeChanged = 'FIELD_ARGUMENT_TYPE_CHANGED',
  // Directive
  DirectiveRemoved = 'DIRECTIVE_REMOVED',
  DirectiveAdded = 'DIRECTIVE_ADDED',
  DirectiveDescriptionChanged = 'DIRECTIVE_DESCRIPTION_CHANGED',
  DirectiveLocationAdded = 'DIRECTIVE_LOCATION_ADDED',
  DirectiveLocationRemoved = 'DIRECTIVE_LOCATION_REMOVED',
  DirectiveArgumentAdded = 'DIRECTIVE_ARGUMENT_ADDED',
  DirectiveArgumentRemoved = 'DIRECTIVE_ARGUMENT_REMOVED',
  DirectiveArgumentDescriptionChanged = 'DIRECTIVE_ARGUMENT_DESCRIPTION_CHANGED',
  DirectiveArgumentDefaultValueChanged = 'DIRECTIVE_ARGUMENT_DEFAULT_VALUE_CHANGED',
  DirectiveArgumentTypeChanged = 'DIRECTIVE_ARGUMENT_TYPE_CHANGED',
  // Enum
  EnumValueRemoved = 'ENUM_VALUE_REMOVED',
  EnumValueAdded = 'ENUM_VALUE_ADDED',
  EnumValueDescriptionChanged = 'ENUM_VALUE_DESCRIPTION_CHANGED',
  EnumValueDeprecationReasonChanged = 'ENUM_VALUE_DEPRECATION_REASON_CHANGED',
  EnumValueDeprecationReasonAdded = 'ENUM_VALUE_DEPRECATION_REASON_ADDED',
  EnumValueDeprecationReasonRemoved = 'ENUM_VALUE_DEPRECATION_REASON_REMOVED',
  // Field
  FieldRemoved = 'FIELD_REMOVED',
  FieldAdded = 'FIELD_ADDED',
  FieldDescriptionChanged = 'FIELD_DESCRIPTION_CHANGED',
  FieldDescriptionAdded = 'FIELD_DESCRIPTION_ADDED',
  FieldDescriptionRemoved = 'FIELD_DESCRIPTION_REMOVED',
  FieldDeprecationAdded = 'FIELD_DEPRECATION_ADDED',
  FieldDeprecationRemoved = 'FIELD_DEPRECATION_REMOVED',
  FieldDeprecationReasonChanged = 'FIELD_DEPRECATION_REASON_CHANGED',
  FieldDeprecationReasonAdded = 'FIELD_DEPRECATION_REASON_ADDED',
  FieldDeprecationReasonRemoved = 'FIELD_DEPRECATION_REASON_REMOVED',
  FieldTypeChanged = 'FIELD_TYPE_CHANGED',
  FieldArgumentAdded = 'FIELD_ARGUMENT_ADDED',
  FieldArgumentRemoved = 'FIELD_ARGUMENT_REMOVED',
  // Input
  InputFieldRemoved = 'INPUT_FIELD_REMOVED',
  InputFieldAdded = 'INPUT_FIELD_ADDED',
  InputFieldDescriptionAdded = 'INPUT_FIELD_DESCRIPTION_ADDED',
  InputFieldDescriptionRemoved = 'INPUT_FIELD_DESCRIPTION_REMOVED',
  InputFieldDescriptionChanged = 'INPUT_FIELD_DESCRIPTION_CHANGED',
  InputFieldDefaultValueChanged = 'INPUT_FIELD_DEFAULT_VALUE_CHANGED',
  InputFieldTypeChanged = 'INPUT_FIELD_TYPE_CHANGED',
  // Type
  ObjectTypeInterfaceAdded = 'OBJECT_TYPE_INTERFACE_ADDED',
  ObjectTypeInterfaceRemoved = 'OBJECT_TYPE_INTERFACE_REMOVED',
  // Schema
  SchemaQueryTypeChanged = 'SCHEMA_QUERY_TYPE_CHANGED',
  SchemaMutationTypeChanged = 'SCHEMA_MUTATION_TYPE_CHANGED',
  SchemaSubscriptionTypeChanged = 'SCHEMA_SUBSCRIPTION_TYPE_CHANGED',
  // Type
  TypeRemoved = 'TYPE_REMOVED',
  TypeAdded = 'TYPE_ADDED',
  TypeKindChanged = 'TYPE_KIND_CHANGED',
  TypeDescriptionChanged = 'TYPE_DESCRIPTION_CHANGED',
  // TODO
  TypeDescriptionRemoved = 'TYPE_DESCRIPTION_REMOVED',
  // TODO
  TypeDescriptionAdded = 'TYPE_DESCRIPTION_ADDED',
  // Union
  UnionMemberRemoved = 'UNION_MEMBER_REMOVED',
  UnionMemberAdded = 'UNION_MEMBER_ADDED',
}

export enum CriticalityLevel {
  Breaking = 'BREAKING',
  NonBreaking = 'NON_BREAKING',
  Dangerous = 'DANGEROUS',
}

export interface Criticality {
  level: CriticalityLevel;
  reason?: string;
}

export interface Change<TChange extends keyof Changes = any> {
  message: string;
  path?: string;
  type: TChange;
  meta: Changes[TChange]['meta'];
  criticality: Criticality;
}

// Directive

export type FieldArgumentDescriptionChangedChange = {
  type: ChangeType.FieldArgumentDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldDescription: string | null;
    newDescription: string | null;
  };
};

export type FieldArgumentDefaultChangedChange = {
  type: ChangeType.FieldArgumentDefaultChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldDefaultValue?: string;
    newDefaultValue?: string;
  };
};

export type FieldArgumentTypeChangedChange = {
  type: ChangeType.FieldArgumentTypeChanged;
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
  type: ChangeType.DirectiveRemoved;
  meta: {
    removedDirectiveName: string;
  };
};

export type DirectiveAddedChange = {
  type: ChangeType.DirectiveAdded;
  meta: {
    addedDirectiveName: string;
  };
};

export type DirectiveDescriptionChangedChange = {
  type: ChangeType.DirectiveDescriptionChanged;
  meta: {
    directiveName: string;
    oldDirectiveDescription: string | null;
    newDirectiveDescription: string | null;
  };
};

export type DirectiveLocationAddedChange = {
  type: ChangeType.DirectiveLocationAdded;
  meta: {
    directiveName: string;
    addedDirectiveLocation: string;
  };
};

export type DirectiveLocationRemovedChange = {
  type: ChangeType.DirectiveLocationRemoved;
  meta: {
    directiveName: string;
    removedDirectiveLocation: string;
  };
};

export type DirectiveArgumentAddedChange = {
  type: ChangeType.DirectiveArgumentAdded;
  meta: {
    directiveName: string;
    addedDirectiveArgumentName: string;
    addedDirectiveArgumentTypeIsNonNull: boolean;
  };
};

export type DirectiveArgumentRemovedChange = {
  type: ChangeType.DirectiveArgumentRemoved;
  meta: {
    directiveName: string;
    removedDirectiveArgumentName: string;
  };
};

export type DirectiveArgumentDescriptionChangedChange = {
  type: ChangeType.DirectiveArgumentDescriptionChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentDescription: string | null;
    newDirectiveArgumentDescription: string | null;
  };
};

export type DirectiveArgumentDefaultValueChangedChange = {
  type: ChangeType.DirectiveArgumentDefaultValueChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentDefaultValue?: string /* | null */;
    newDirectiveArgumentDefaultValue?: string /* | null */;
  };
};

export type DirectiveArgumentTypeChangedChange = {
  type: ChangeType.DirectiveArgumentTypeChanged;
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
  type: ChangeType.EnumValueRemoved;
  meta: {
    enumName: string;
    removedEnumValueName: string;
    isEnumValueDeprecated: boolean;
  };
};

export type EnumValueAddedChange = {
  type: ChangeType.EnumValueAdded;
  meta: {
    enumName: string;
    addedEnumValueName: string;
  };
};

export type EnumValueDescriptionChangedChange = {
  type: ChangeType.EnumValueDescriptionChanged;
  meta: {
    enumName: string;
    enumValueName: string;
    oldEnumValueDescription: string | null;
    newEnumValueDescription: string | null;
  };
};

export type EnumValueDeprecationReasonChangedChange = {
  type: ChangeType.EnumValueDeprecationReasonChanged;
  meta: {
    enumName: string;
    enumValueName: string;
    oldEnumValueDeprecationReason: string;
    newEnumValueDeprecationReason: string;
  };
};

export type EnumValueDeprecationReasonAddedChange = {
  type: ChangeType.EnumValueDeprecationReasonAdded;
  meta: {
    enumName: string;
    enumValueName: string;
    addedValueDeprecationReason: string;
  };
};

export type EnumValueDeprecationReasonRemovedChange = {
  type: ChangeType.EnumValueDeprecationReasonRemoved;
  meta: {
    enumName: string;
    enumValueName: string;
    removedEnumValueDeprecationReason: string;
  };
};

// Field

export type FieldRemovedChange = {
  type: ChangeType.FieldRemoved;
  meta: {
    typeName: string;
    removedFieldName: string;
    isRemovedFieldDeprecated: boolean;
    typeType: string;
  };
};

export type FieldAddedChange = {
  type: ChangeType.FieldAdded;
  meta: {
    typeName: string;
    addedFieldName: string;
    typeType: string;
  };
};

export type FieldDescriptionChangedChange = {
  type: ChangeType.FieldDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDescription: string;
    newDescription: string;
  };
};

export type FieldDescriptionAddedChange = {
  type: ChangeType.FieldDescriptionAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDescription: string;
  };
};

export type FieldDescriptionRemovedChange = {
  type: ChangeType.FieldDescriptionRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationAddedChange = {
  type: ChangeType.FieldDeprecationAdded;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationRemovedChange = {
  type: ChangeType.FieldDeprecationRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationReasonChangedChange = {
  type: ChangeType.FieldDeprecationReasonChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDeprecationReason: string;
    newDeprecationReason: string;
  };
};

export type FieldDeprecationReasonAddedChange = {
  type: ChangeType.FieldDeprecationReasonAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDeprecationReason: string;
  };
};

export type FieldDeprecationReasonRemovedChange = {
  type: ChangeType.FieldDeprecationReasonRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldTypeChangedChange = {
  type: ChangeType.FieldTypeChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldFieldType: string;
    newFieldType: string;
    isSafeFieldTypeChange: boolean;
  };
};

export type FieldArgumentAddedChange = {
  type: ChangeType.FieldArgumentAdded;
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
  type: ChangeType.FieldArgumentRemoved;
  meta: {
    typeName: string;
    fieldName: string;
    removedFieldArgumentName: string;
    removedFieldType: string;
  };
};

// Input

export type InputFieldRemovedChange = {
  type: ChangeType.InputFieldRemoved;
  meta: {
    inputName: string;
    removedFieldName: string;
    isInputFieldDeprecated: boolean;
  };
};

export type InputFieldAddedChange = {
  type: ChangeType.InputFieldAdded;
  meta: {
    inputName: string;
    addedInputFieldName: string;
    isAddedInputFieldTypeNullable: boolean;
  };
};

export type InputFieldDescriptionAddedChange = {
  type: ChangeType.InputFieldDescriptionAdded;
  meta: {
    inputName: string;
    inputFieldName: string;
    addedInputFieldDescription: string;
  };
};

export type InputFieldDescriptionRemovedChange = {
  type: ChangeType.InputFieldDescriptionRemoved;
  meta: {
    inputName: string;
    inputFieldName: string;
  };
};

export type InputFieldDescriptionChangedChange = {
  type: ChangeType.InputFieldDescriptionChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldInputFieldDescription: string;
    newInputFieldDescription: string;
  };
};

export type InputFieldDefaultValueChangedChange = {
  type: ChangeType.InputFieldDefaultValueChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldDefaultValue?: string /* null | */;
    newDefaultValue?: string /* null | */;
  };
};

export type InputFieldTypeChangedChange = {
  type: ChangeType.InputFieldTypeChanged;
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
  type: ChangeType.ObjectTypeInterfaceAdded;
  meta: {
    objectTypeName: string;
    addedInterfaceName: string;
  };
};

export type ObjectTypeInterfaceRemovedChange = {
  type: ChangeType.ObjectTypeInterfaceRemoved;
  meta: {
    objectTypeName: string;
    removedInterfaceName: string;
  };
};

// Schema

export type SchemaQueryTypeChangedChange = {
  type: ChangeType.SchemaQueryTypeChanged;
  meta: {
    oldQueryTypeName: string;
    newQueryTypeName: string;
  };
};

export type SchemaMutationTypeChangedChange = {
  type: ChangeType.SchemaMutationTypeChanged;
  meta: {
    oldMutationTypeName: string;
    newMutationTypeName: string;
  };
};

export type SchemaSubscriptionTypeChangedChange = {
  type: ChangeType.SchemaSubscriptionTypeChanged;
  meta: {
    oldSubscriptionTypeName: string;
    newSubscriptionTypeName: string;
  };
};

// Type

export type TypeRemovedChange = {
  type: ChangeType.TypeRemoved;
  meta: {
    removedTypeName: string;
  };
};

export type TypeAddedChange = {
  type: ChangeType.TypeAdded;
  meta: {
    addedTypeName: string;
  };
};

export type TypeKindChangedChange = {
  type: ChangeType.TypeKindChanged;
  meta: {
    typeName: string;
    oldTypeKind: string;
    newTypeKind: string;
  };
};

export type TypeDescriptionChangedChange = {
  type: ChangeType.TypeDescriptionChanged;
  meta: {
    typeName: string;
    oldTypeDescription: string;
    newTypeDescription: string;
  };
};

export type TypeDescriptionAddedChange = {
  type: ChangeType.TypeDescriptionAdded;
  meta: {
    typeName: string;
    addedTypeDescription: string;
  };
};

export type TypeDescriptionRemovedChange = {
  type: ChangeType.TypeDescriptionRemoved;
  meta: {
    typeName: string;
    removedTypeDescription: string;
  };
};

// Union

export type UnionMemberRemovedChange = {
  type: ChangeType.UnionMemberRemoved;
  meta: {
    unionName: string;
    removedUnionMemberTypeName: string;
  };
};

export type UnionMemberAddedChange = {
  type: ChangeType.UnionMemberAdded;
  meta: {
    unionName: string;
    addedUnionMemberTypeName: string;
  };
};

type Changes = {
  [ChangeType.TypeAdded]: TypeAddedChange;
  [ChangeType.TypeRemoved]: TypeRemovedChange;
  [ChangeType.TypeKindChanged]: TypeKindChangedChange;
  [ChangeType.TypeDescriptionChanged]: TypeDescriptionChangedChange;
  [ChangeType.TypeDescriptionAdded]: TypeDescriptionAddedChange;
  [ChangeType.TypeDescriptionRemoved]: TypeDescriptionRemovedChange;
  [ChangeType.UnionMemberRemoved]: UnionMemberRemovedChange;
  [ChangeType.UnionMemberAdded]: UnionMemberAddedChange;
  [ChangeType.SchemaQueryTypeChanged]: SchemaQueryTypeChangedChange;
  [ChangeType.SchemaMutationTypeChanged]: SchemaMutationTypeChangedChange;
  [ChangeType.SchemaSubscriptionTypeChanged]: SchemaSubscriptionTypeChangedChange;
  [ChangeType.ObjectTypeInterfaceAdded]: ObjectTypeInterfaceAddedChange;
  [ChangeType.ObjectTypeInterfaceRemoved]: ObjectTypeInterfaceRemovedChange;
  [ChangeType.InputFieldRemoved]: InputFieldRemovedChange;
  [ChangeType.InputFieldAdded]: InputFieldAddedChange;
  [ChangeType.InputFieldDescriptionAdded]: InputFieldDescriptionAddedChange;
  [ChangeType.InputFieldDescriptionRemoved]: InputFieldDescriptionRemovedChange;
  [ChangeType.InputFieldDescriptionChanged]: InputFieldDescriptionChangedChange;
  [ChangeType.InputFieldDefaultValueChanged]: InputFieldDefaultValueChangedChange;
  [ChangeType.InputFieldTypeChanged]: InputFieldTypeChangedChange;
  [ChangeType.FieldRemoved]: FieldRemovedChange;
  [ChangeType.FieldAdded]: FieldAddedChange;
  [ChangeType.FieldDescriptionAdded]: FieldDescriptionAddedChange;
  [ChangeType.FieldDescriptionRemoved]: FieldDescriptionRemovedChange;
  [ChangeType.FieldDescriptionChanged]: FieldDescriptionChangedChange;
  [ChangeType.FieldArgumentAdded]: FieldArgumentAddedChange;
  [ChangeType.FieldArgumentRemoved]: FieldArgumentRemovedChange;
  [ChangeType.InputFieldRemoved]: InputFieldRemovedChange;
  [ChangeType.InputFieldAdded]: InputFieldAddedChange;
  [ChangeType.InputFieldDescriptionAdded]: InputFieldDescriptionAddedChange;
  [ChangeType.InputFieldDescriptionRemoved]: InputFieldDescriptionRemovedChange;
  [ChangeType.InputFieldDescriptionChanged]: InputFieldDescriptionChangedChange;
  [ChangeType.InputFieldDefaultValueChanged]: InputFieldDefaultValueChangedChange;
  [ChangeType.InputFieldTypeChanged]: InputFieldTypeChangedChange;
  [ChangeType.ObjectTypeInterfaceAdded]: ObjectTypeInterfaceAddedChange;
  [ChangeType.ObjectTypeInterfaceRemoved]: ObjectTypeInterfaceRemovedChange;
  [ChangeType.SchemaQueryTypeChanged]: SchemaQueryTypeChangedChange;
  [ChangeType.SchemaMutationTypeChanged]: SchemaMutationTypeChangedChange;
  [ChangeType.SchemaSubscriptionTypeChanged]: SchemaSubscriptionTypeChangedChange;
  [ChangeType.TypeAdded]: TypeAddedChange;
  [ChangeType.TypeRemoved]: TypeRemovedChange;
  [ChangeType.TypeKindChanged]: TypeKindChangedChange;
  [ChangeType.TypeDescriptionChanged]: TypeDescriptionChangedChange;
  [ChangeType.TypeDescriptionRemoved]: TypeDescriptionRemovedChange;
  [ChangeType.TypeDescriptionAdded]: TypeDescriptionAddedChange;
  [ChangeType.UnionMemberAdded]: UnionMemberAddedChange;
  [ChangeType.UnionMemberRemoved]: UnionMemberRemovedChange;
  [ChangeType.DirectiveRemoved]: DirectiveRemovedChange;
  [ChangeType.DirectiveAdded]: DirectiveAddedChange;
  [ChangeType.DirectiveArgumentAdded]: DirectiveArgumentAddedChange;
  [ChangeType.DirectiveArgumentRemoved]: DirectiveArgumentRemovedChange;
  [ChangeType.DirectiveArgumentDescriptionChanged]: DirectiveArgumentDescriptionChangedChange;
  [ChangeType.DirectiveArgumentDefaultValueChanged]: DirectiveArgumentDefaultValueChangedChange;
  [ChangeType.DirectiveArgumentTypeChanged]: DirectiveArgumentTypeChangedChange;
  [ChangeType.DirectiveDescriptionChanged]: DirectiveDescriptionChangedChange;
  [ChangeType.FieldArgumentDescriptionChanged]: FieldArgumentDescriptionChangedChange;
  [ChangeType.FieldArgumentDefaultChanged]: FieldArgumentDefaultChangedChange;
  [ChangeType.FieldArgumentTypeChanged]: FieldArgumentTypeChangedChange;
  [ChangeType.DirectiveLocationAdded]: DirectiveLocationAddedChange;
  [ChangeType.DirectiveLocationRemoved]: DirectiveLocationRemovedChange;
  [ChangeType.EnumValueRemoved]: EnumValueRemovedChange;
  [ChangeType.EnumValueDescriptionChanged]: EnumValueDescriptionChangedChange;
  [ChangeType.EnumValueDeprecationReasonChanged]: EnumValueDeprecationReasonChangedChange;
  [ChangeType.EnumValueDeprecationReasonAdded]: EnumValueDeprecationReasonAddedChange;
  [ChangeType.EnumValueDeprecationReasonRemoved]: EnumValueDeprecationReasonRemovedChange;
  [ChangeType.EnumValueAdded]: EnumValueAddedChange;
  [ChangeType.FieldDeprecationAdded]: FieldDeprecationAddedChange;
  [ChangeType.FieldDeprecationRemoved]: FieldDeprecationRemovedChange;
  [ChangeType.FieldDeprecationReasonChanged]: FieldDeprecationReasonChangedChange;
  [ChangeType.FieldDeprecationReasonAdded]: FieldDeprecationReasonAddedChange;
  [ChangeType.FieldDeprecationReasonRemoved]: FieldDeprecationReasonRemovedChange;
  [ChangeType.FieldTypeChanged]: FieldTypeChangedChange;
};

export type SerializableChange = Changes[keyof Changes];
