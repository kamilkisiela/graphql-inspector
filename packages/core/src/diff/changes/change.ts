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

export type FieldArgumentDescriptionChanged = {
  type: ChangeType.FieldArgumentDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldDescription: string | null;
    newDescription: string | null;
  };
};

export type FieldArgumentDefaultChanged = {
  type: ChangeType.FieldArgumentDefaultChanged;
  meta: {
    typeName: string;
    fieldName: string;
    argumentName: string;
    oldDefaultValue?: string;
    newDefaultValue?: string;
  };
};

export type FieldArgumentTypeChanged = {
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

export type DirectiveRemoved = {
  type: ChangeType.DirectiveRemoved;
  meta: {
    removedDirectiveName: string;
  };
};

export type DirectiveAdded = {
  type: ChangeType.DirectiveAdded;
  meta: {
    addedDirectiveName: string;
  };
};

export type DirectiveDescriptionChanged = {
  type: ChangeType.DirectiveDescriptionChanged;
  meta: {
    directiveName: string;
    oldDirectiveDescription: string | null;
    newDirectiveDescription: string | null;
  };
};

export type DirectiveLocationAdded = {
  type: ChangeType.DirectiveLocationAdded;
  meta: {
    directiveName: string;
    addedDirectiveLocation: string;
  };
};

export type DirectiveLocationRemoved = {
  type: ChangeType.DirectiveLocationRemoved;
  meta: {
    directiveName: string;
    removedDirectiveLocation: string;
  };
};

export type DirectiveArgumentAdded = {
  type: ChangeType.DirectiveArgumentAdded;
  meta: {
    directiveName: string;
    addedDirectiveArgumentName: string;
    addedDirectiveArgumentTypeIsNonNull: boolean;
  };
};

export type DirectiveArgumentRemoved = {
  type: ChangeType.DirectiveArgumentRemoved;
  meta: {
    directiveName: string;
    removedDirectiveArgumentName: string;
  };
};

export type DirectiveArgumentDescriptionChanged = {
  type: ChangeType.DirectiveArgumentDescriptionChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentDescription: string | null;
    newDirectiveArgumentDescription: string | null;
  };
};

export type DirectiveArgumentDefaultValueChanged = {
  type: ChangeType.DirectiveArgumentDefaultValueChanged;
  meta: {
    directiveName: string;
    directiveArgumentName: string;
    oldDirectiveArgumentDefaultValue?: string /* | null */;
    newDirectiveArgumentDefaultValue?: string /* | null */;
  };
};

export type DirectiveArgumentTypeChanged = {
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

export type EnumValueRemoved = {
  type: ChangeType.EnumValueRemoved;
  meta: {
    enumName: string;
    removedEnumValueName: string;
    isEnumValueDeprecated: boolean;
  };
};

export type EnumValueAdded = {
  type: ChangeType.EnumValueAdded;
  meta: {
    enumName: string;
    addedEnumValueName: string;
  };
};

export type EnumValueDescriptionChanged = {
  type: ChangeType.EnumValueDescriptionChanged;
  meta: {
    enumName: string;
    enumValueName: string;
    oldEnumValueDescription: string | null;
    newEnumValueDescription: string | null;
  };
};

export type EnumValueDeprecationReasonChanged = {
  type: ChangeType.EnumValueDeprecationReasonChanged;
  meta: {
    enumName: string;
    enumValueName: string;
    oldEnumValueDeprecationReason: string;
    newEnumValueDeprecationReason: string;
  };
};

export type EnumValueDeprecationReasonAdded = {
  type: ChangeType.EnumValueDeprecationReasonAdded;
  meta: {
    enumName: string;
    enumValueName: string;
    addedValueDeprecationReason: string;
  };
};

export type EnumValueDeprecationReasonRemoved = {
  type: ChangeType.EnumValueDeprecationReasonRemoved;
  meta: {
    enumName: string;
    enumValueName: string;
    removedEnumValueDeprecationReason: string;
  };
};

// Field

export type FieldRemoved = {
  type: ChangeType.FieldRemoved;
  meta: {
    typeName: string;
    removedFieldName: string;
    isRemovedFieldDeprecated: boolean;
    typeType: string;
  };
};

export type FieldAdded = {
  type: ChangeType.FieldAdded;
  meta: {
    typeName: string;
    addedFieldName: string;
    typeType: string;
  };
};

export type FieldDescriptionChanged = {
  type: ChangeType.FieldDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDescription: string;
    newDescription: string;
  };
};

export type FieldDescriptionAdded = {
  type: ChangeType.FieldDescriptionAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDescription: string;
  };
};

export type FieldDescriptionRemoved = {
  type: ChangeType.FieldDescriptionRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationAdded = {
  type: ChangeType.FieldDeprecationAdded;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationRemoved = {
  type: ChangeType.FieldDeprecationRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldDeprecationReasonChanged = {
  type: ChangeType.FieldDeprecationReasonChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDeprecationReason: string;
    newDeprecationReason: string;
  };
};

export type FieldDeprecationReasonAdded = {
  type: ChangeType.FieldDeprecationReasonAdded;
  meta: {
    typeName: string;
    fieldName: string;
    addedDeprecationReason: string;
  };
};

export type FieldDeprecationReasonRemoved = {
  type: ChangeType.FieldDeprecationReasonRemoved;
  meta: {
    typeName: string;
    fieldName: string;
  };
};

export type FieldTypeChanged = {
  type: ChangeType.FieldTypeChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldFieldType: string;
    newFieldType: string;
    isSafeFieldTypeChange: boolean;
  };
};

export type FieldArgumentAdded = {
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

export type FieldArgumentRemoved = {
  type: ChangeType.FieldArgumentRemoved;
  meta: {
    typeName: string;
    fieldName: string;
    removedFieldArgumentName: string;
    removedFieldType: string;
  };
};

// Input

export type InputFieldRemoved = {
  type: ChangeType.InputFieldRemoved;
  meta: {
    inputName: string;
    removedFieldName: string;
    isInputFieldDeprecated: boolean;
  };
};

export type InputFieldAdded = {
  type: ChangeType.InputFieldAdded;
  meta: {
    inputName: string;
    addedInputFieldName: string;
    isAddedInputFieldTypeNullable: boolean;
  };
};

export type InputFieldDescriptionAdded = {
  type: ChangeType.InputFieldDescriptionAdded;
  meta: {
    inputName: string;
    inputFieldName: string;
    addedInputFieldDescription: string;
  };
};

export type InputFieldDescriptionRemoved = {
  type: ChangeType.InputFieldDescriptionRemoved;
  meta: {
    inputName: string;
    inputFieldName: string;
  };
};

export type InputFieldDescriptionChanged = {
  type: ChangeType.InputFieldDescriptionChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldInputFieldDescription: string;
    newInputFieldDescription: string;
  };
};

export type InputFieldDefaultValueChanged = {
  type: ChangeType.InputFieldDefaultValueChanged;
  meta: {
    inputName: string;
    inputFieldName: string;
    oldDefaultValue?: string /* null | */;
    newDefaultValue?: string /* null | */;
  };
};

export type InputFieldTypeChanged = {
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

export type ObjectTypeInterfaceAdded = {
  type: ChangeType.ObjectTypeInterfaceAdded;
  meta: {
    objectTypeName: string;
    addedInterfaceName: string;
  };
};

export type ObjectTypeInterfaceRemoved = {
  type: ChangeType.ObjectTypeInterfaceRemoved;
  meta: {
    objectTypeName: string;
    removedInterfaceName: string;
  };
};

// Schema

export type SchemaQueryTypeChanged = {
  type: ChangeType.SchemaQueryTypeChanged;
  meta: {
    oldQueryTypeName: string;
    newQueryTypeName: string;
  };
};

export type SchemaMutationTypeChanged = {
  type: ChangeType.SchemaMutationTypeChanged;
  meta: {
    oldMutationTypeName: string;
    newMutationTypeName: string;
  };
};

export type SchemaSubscriptionTypeChanged = {
  type: ChangeType.SchemaSubscriptionTypeChanged;
  meta: {
    oldSubscriptionTypeName: string;
    newSubscriptionTypeName: string;
  };
};

// Type

export type TypeRemoved = {
  type: ChangeType.TypeRemoved;
  meta: {
    removedTypeName: string;
  };
};

export type TypeAdded = {
  type: ChangeType.TypeAdded;
  meta: {
    addedTypeName: string;
  };
};

export type TypeKindChanged = {
  type: ChangeType.TypeKindChanged;
  meta: {
    typeName: string;
    oldTypeKind: string;
    newTypeKind: string;
  };
};

export type TypeDescriptionChanged = {
  type: ChangeType.TypeDescriptionChanged;
  meta: {
    typeName: string;
    oldTypeDescription: string;
    newTypeDescription: string;
  };
};

export type TypeDescriptionAdded = {
  type: ChangeType.TypeDescriptionAdded;
  meta: {
    typeName: string;
    addedTypeDescription: string;
  };
};

export type TypeDescriptionRemoved = {
  type: ChangeType.TypeDescriptionRemoved;
  meta: {
    typeName: string;
    removedTypeDescription: string;
  };
};

// Union

export type UnionMemberRemoved = {
  type: ChangeType.UnionMemberRemoved;
  meta: {
    unionName: string;
    removedUnionMemberTypeName: string;
  };
};

export type UnionMemberAdded = {
  type: ChangeType.UnionMemberAdded;
  meta: {
    unionName: string;
    addedUnionMemberTypeName: string;
  };
};

type Changes = {
  [ChangeType.TypeAdded]: TypeAdded;
  [ChangeType.TypeRemoved]: TypeRemoved;
  [ChangeType.TypeKindChanged]: TypeKindChanged;
  [ChangeType.TypeDescriptionChanged]: TypeDescriptionChanged;
  [ChangeType.TypeDescriptionAdded]: TypeDescriptionAdded;
  [ChangeType.TypeDescriptionRemoved]: TypeDescriptionRemoved;
  [ChangeType.UnionMemberRemoved]: UnionMemberRemoved;
  [ChangeType.UnionMemberAdded]: UnionMemberAdded;
  [ChangeType.SchemaQueryTypeChanged]: SchemaQueryTypeChanged;
  [ChangeType.SchemaMutationTypeChanged]: SchemaMutationTypeChanged;
  [ChangeType.SchemaSubscriptionTypeChanged]: SchemaSubscriptionTypeChanged;
  [ChangeType.ObjectTypeInterfaceAdded]: ObjectTypeInterfaceAdded;
  [ChangeType.ObjectTypeInterfaceRemoved]: ObjectTypeInterfaceRemoved;
  [ChangeType.InputFieldRemoved]: InputFieldRemoved;
  [ChangeType.InputFieldAdded]: InputFieldAdded;
  [ChangeType.InputFieldDescriptionAdded]: InputFieldDescriptionAdded;
  [ChangeType.InputFieldDescriptionRemoved]: InputFieldDescriptionRemoved;
  [ChangeType.InputFieldDescriptionChanged]: InputFieldDescriptionChanged;
  [ChangeType.InputFieldDefaultValueChanged]: InputFieldDefaultValueChanged;
  [ChangeType.InputFieldTypeChanged]: InputFieldTypeChanged;
  [ChangeType.FieldRemoved]: FieldRemoved;
  [ChangeType.FieldAdded]: FieldAdded;
  [ChangeType.FieldDescriptionAdded]: FieldDescriptionAdded;
  [ChangeType.FieldDescriptionRemoved]: FieldDescriptionRemoved;
  [ChangeType.FieldDescriptionChanged]: FieldDescriptionChanged;
  [ChangeType.FieldArgumentAdded]: FieldArgumentAdded;
  [ChangeType.FieldArgumentRemoved]: FieldArgumentRemoved;
  [ChangeType.InputFieldRemoved]: InputFieldRemoved;
  [ChangeType.InputFieldAdded]: InputFieldAdded;
  [ChangeType.InputFieldDescriptionAdded]: InputFieldDescriptionAdded;
  [ChangeType.InputFieldDescriptionRemoved]: InputFieldDescriptionRemoved;
  [ChangeType.InputFieldDescriptionChanged]: InputFieldDescriptionChanged;
  [ChangeType.InputFieldDefaultValueChanged]: InputFieldDefaultValueChanged;
  [ChangeType.InputFieldTypeChanged]: InputFieldTypeChanged;
  [ChangeType.ObjectTypeInterfaceAdded]: ObjectTypeInterfaceAdded;
  [ChangeType.ObjectTypeInterfaceRemoved]: ObjectTypeInterfaceRemoved;
  [ChangeType.SchemaQueryTypeChanged]: SchemaQueryTypeChanged;
  [ChangeType.SchemaMutationTypeChanged]: SchemaMutationTypeChanged;
  [ChangeType.SchemaSubscriptionTypeChanged]: SchemaSubscriptionTypeChanged;
  [ChangeType.TypeAdded]: TypeAdded;
  [ChangeType.TypeRemoved]: TypeRemoved;
  [ChangeType.TypeKindChanged]: TypeKindChanged;
  [ChangeType.TypeDescriptionChanged]: TypeDescriptionChanged;
  [ChangeType.TypeDescriptionRemoved]: TypeDescriptionRemoved;
  [ChangeType.TypeDescriptionAdded]: TypeDescriptionAdded;
  [ChangeType.UnionMemberAdded]: UnionMemberAdded;
  [ChangeType.UnionMemberRemoved]: UnionMemberRemoved;
  [ChangeType.DirectiveRemoved]: DirectiveRemoved;
  [ChangeType.DirectiveAdded]: DirectiveAdded;
  [ChangeType.DirectiveArgumentAdded]: DirectiveArgumentAdded;
  [ChangeType.DirectiveArgumentRemoved]: DirectiveArgumentRemoved;
  [ChangeType.DirectiveArgumentDescriptionChanged]: DirectiveArgumentDescriptionChanged;
  [ChangeType.DirectiveArgumentDefaultValueChanged]: DirectiveArgumentDefaultValueChanged;
  [ChangeType.DirectiveArgumentTypeChanged]: DirectiveArgumentTypeChanged;
  [ChangeType.DirectiveDescriptionChanged]: DirectiveDescriptionChanged;
  [ChangeType.FieldArgumentDescriptionChanged]: FieldArgumentDescriptionChanged;
  [ChangeType.FieldArgumentDefaultChanged]: FieldArgumentDefaultChanged;
  [ChangeType.FieldArgumentTypeChanged]: FieldArgumentTypeChanged;
  [ChangeType.DirectiveLocationAdded]: DirectiveLocationAdded;
  [ChangeType.DirectiveLocationRemoved]: DirectiveLocationRemoved;
  [ChangeType.EnumValueRemoved]: EnumValueRemoved;
  [ChangeType.EnumValueDescriptionChanged]: EnumValueDescriptionChanged;
  [ChangeType.EnumValueDeprecationReasonChanged]: EnumValueDeprecationReasonChanged;
  [ChangeType.EnumValueDeprecationReasonAdded]: EnumValueDeprecationReasonAdded;
  [ChangeType.EnumValueDeprecationReasonRemoved]: EnumValueDeprecationReasonRemoved;
  [ChangeType.EnumValueAdded]: EnumValueAdded;
  [ChangeType.FieldDeprecationAdded]: FieldDeprecationAdded;
  [ChangeType.FieldDeprecationRemoved]: FieldDeprecationRemoved;
  [ChangeType.FieldDeprecationReasonChanged]: FieldDeprecationReasonChanged;
  [ChangeType.FieldDeprecationReasonAdded]: FieldDeprecationReasonAdded;
  [ChangeType.FieldDeprecationReasonRemoved]: FieldDeprecationReasonRemoved;
  [ChangeType.FieldTypeChanged]: FieldTypeChanged;
};
