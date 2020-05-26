import {
  GraphQLInputType,
  isWrappingType,
  isListType,
  isNonNullType,
  GraphQLOutputType,
  GraphQLNamedType,
  KindEnum,
  Kind,
  GraphQLSchema,
  GraphQLError,
  DocumentNode,
  TypeInfo,
  visit,
  visitWithTypeInfo,
  getNamedType,
  FieldNode,
} from 'graphql';

export function safeChangeForField(
  oldType: GraphQLOutputType,
  newType: GraphQLOutputType,
): boolean {
  if (!isWrappingType(oldType) && !isWrappingType(newType)) {
    return oldType.toString() === newType.toString();
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
    return oldType.toString() === newType.toString();
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

export function getKind(type: GraphQLNamedType): KindEnum {
  const node = type.astNode as any;
  return (node && node.kind) || '';
}

export function getTypePrefix(type: GraphQLNamedType): string {
  const kind: KindEnum = getKind(type);

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

export function findDeprecatedUsages(
  schema: GraphQLSchema,
  ast: DocumentNode,
): Array<GraphQLError> {
  const errors: GraphQLError[] = [];
  const typeInfo = new TypeInfo(schema);

  visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      Field(node) {
        const fieldDef = typeInfo.getFieldDef();
        if (fieldDef && fieldDef.isDeprecated) {
          const parentType = typeInfo.getParentType();
          if (parentType) {
            const reason = fieldDef.deprecationReason;
            errors.push(
              new GraphQLError(
                `The field '${parentType.name}.${
                  fieldDef.name
                }' is deprecated.${reason ? ' ' + reason : ''}`,
                [node],
              ),
            );
          }
        }
      },
      EnumValue(node) {
        const enumVal = typeInfo.getEnumValue();
        if (enumVal && enumVal.isDeprecated) {
          const type = getNamedType(typeInfo.getInputType()!);
          if (type) {
            const reason = enumVal.deprecationReason;
            errors.push(
              new GraphQLError(
                `The enum value '${type.name}.${enumVal.name}' is deprecated.${
                  reason ? ' ' + reason : ''
                }`,
                [node],
              ),
            );
          }
        }
      },
    }),
  );

  return errors;
}

export function removeFieldIfDirectives(
  node: FieldNode,
  directiveNames: string[],
): FieldNode | null {
  if (node.directives) {
    if (
      node.directives.some((d) => directiveNames.indexOf(d.name.value) !== -1)
    ) {
      return null;
    }
  }

  return node;
}

export function removeDirectives(
  node: FieldNode,
  directiveNames: string[],
): FieldNode {
  if (node.directives) {
    return {
      ...node,
      directives: node.directives.filter(
        (d) => directiveNames.indexOf(d.name.value) === -1,
      ),
    };
  }

  return node;
}
