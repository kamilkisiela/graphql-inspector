import {
  GraphQLInputType,
  isWrappingType,
  isListType,
  isNonNullType,
  GraphQLOutputType,
  GraphQLNamedType,
  KindEnum,
  Kind,
} from 'graphql';

export function safeChangeForField(
  oldType: GraphQLOutputType,
  newType: GraphQLOutputType,
): boolean {
  if (!isWrappingType(oldType) && !isWrappingType(newType)) {
    return oldType === newType;
  }

  if (isNonNullType(newType)) {
    const ofType = isNonNullType(oldType) ? oldType.ofType : oldType;

    return safeChangeForField(ofType, newType.ofType);
  }

  if (isListType(oldType)) {
    return (
      (isListType(newType) &&
        safeChangeForField(oldType.ofType, newType.ofType)) ||
      (isNonNullType(newType) && safeChangeForField(oldType, newType.ofType))
    );
  }

  return false;
}

export function safeChangeForInputValue(
  oldType: GraphQLInputType,
  newType: GraphQLInputType,
): boolean {
  if (!isWrappingType(oldType) && !isWrappingType(newType)) {
    return oldType === newType;
  }

  if (isListType(oldType) && isListType(newType)) {
    return safeChangeForInputValue(oldType.ofType, newType.ofType);
  }

  if (isNonNullType(oldType)) {
    const ofType = isNonNullType(newType) ? newType : newType;

    return safeChangeForInputValue(oldType.ofType, ofType);
  }

  return false;
}

export function getTypePrefix(type: GraphQLNamedType): string {
  const kind: KindEnum = (type.astNode as any).kind;

  const kindsMap: Record<string, string> = {
    [Kind.SCALAR_TYPE_DEFINITION]: 'scalar',
    [Kind.OBJECT_TYPE_DEFINITION]: 'type',
    [Kind.INTERFACE_TYPE_DEFINITION]: 'interface',
    [Kind.UNION_TYPE_DEFINITION]: 'union',
    [Kind.ENUM_TYPE_DEFINITION]: 'enum',
    [Kind.INPUT_OBJECT_TYPE_DEFINITION]: 'input',
  };

  return kindsMap[kind];
}

export function isPrimitive(type: GraphQLNamedType | string): boolean {
  return (
    ['String', 'Int', 'Float', 'Boolean', 'ID'].indexOf(
      typeof type === 'string' ? type : type.name,
    ) !== -1
  );
}

export function isForIntrospection(type: GraphQLNamedType | string): boolean {
  return (
    [
      '__Schema',
      '__Type',
      '__TypeKind',
      '__Field',
      '__InputValue',
      '__EnumValue',
      '__Directive',
      '__DirectiveLocation',
    ].indexOf(typeof type === 'string' ? type : type.name) !== -1
  );
}
