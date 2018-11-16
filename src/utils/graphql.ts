import {
  GraphQLInputType,
  isWrappingType,
  isListType,
  isNonNullType,
  GraphQLOutputType,
  GraphQLNamedType,
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

export function isPrimitive(type: GraphQLNamedType | string): boolean {
  return (
    ['String', 'Int', 'Float', 'Boolean', 'ID'].indexOf(
      typeof type === 'string' ? type : type.name,
    ) !== -1
  );
}
