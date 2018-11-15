import { GraphQLInputType, isWrappingType, isListType, isNonNullType } from 'graphql';

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
