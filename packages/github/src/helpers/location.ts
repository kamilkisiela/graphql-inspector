import {
  DirectiveDefinitionNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  FieldDefinitionNode,
  getLocation,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  Kind,
  ObjectTypeDefinitionNode,
  parse,
  ScalarTypeDefinitionNode,
  Source,
  SourceLocation,
  TypeDefinitionNode,
  UnionTypeDefinitionNode,
} from 'graphql';

export function getLocationByPath({
  path,
  source,
}: {
  path: string;
  source: Source;
}): SourceLocation {
  const [typeName, ...rest] = path.split('.');
  const isDirective = typeName.startsWith('@');

  const doc = parse(source);

  let resolvedNode: Node = undefined;

  for (const definition of doc.definitions) {
    if (definition.kind === Kind.OBJECT_TYPE_DEFINITION && definition.name.value === typeName) {
      resolvedNode = resolveObjectTypeDefinition(rest, definition);
      break;
    }

    if (
      isDirective &&
      definition.kind === Kind.DIRECTIVE_DEFINITION &&
      definition.name.value === typeName.substring(1)
    ) {
      resolvedNode = resolveDirectiveDefinition(rest, definition);
      break;
    }

    if (definition.kind === Kind.ENUM_TYPE_DEFINITION && definition.name.value === typeName) {
      resolvedNode = resolveEnumTypeDefinition(rest, definition);
      break;
    }

    if (
      definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      resolvedNode = resolveInputObjectTypeDefinition(rest, definition);
      break;
    }

    if (definition.kind === Kind.INTERFACE_TYPE_DEFINITION && definition.name.value === typeName) {
      resolvedNode = resolveInterfaceTypeDefinition(rest, definition);
      break;
    }

    if (definition.kind === Kind.UNION_TYPE_DEFINITION && definition.name.value === typeName) {
      resolvedNode = resolveUnionTypeDefinitionNode(rest, definition);
      break;
    }

    if (definition.kind === Kind.SCALAR_TYPE_DEFINITION && definition.name.value === typeName) {
      resolvedNode = resolveScalarTypeDefinitionNode(rest, definition);
      break;
    }
  }

  return resolveNodeSourceLocation(source, resolvedNode);
}

type Node =
  | TypeDefinitionNode
  | DirectiveDefinitionNode
  | FieldDefinitionNode
  | InputValueDefinitionNode
  | EnumValueDefinitionNode
  | undefined;

function resolveScalarTypeDefinitionNode(
  _path: string[],
  definition: ScalarTypeDefinitionNode,
): Node {
  return definition;
}

function resolveUnionTypeDefinitionNode(
  _path: string[],
  definition: UnionTypeDefinitionNode,
): Node {
  return definition;
}

function resolveArgument(argName: string, field: FieldDefinitionNode) {
  const arg = field.arguments?.find(a => a.name.value === argName);

  return arg || field;
}

function resolveFieldDefinition(
  path: string[],
  definition:
    | InterfaceTypeDefinitionNode
    | InputObjectTypeDefinitionNode
    | ObjectTypeDefinitionNode,
): Node {
  const [fieldName, argName] = path;

  const fieldIndex = definition.fields?.findIndex(
    (f: InputValueDefinitionNode | FieldDefinitionNode) => f.name.value === fieldName,
  );

  if (typeof fieldIndex === 'number' && fieldIndex > -1) {
    const field = definition.fields![fieldIndex];

    if (field.kind !== Kind.INPUT_VALUE_DEFINITION && argName) {
      return resolveArgument(argName, field);
    }

    return field;
  }

  return definition;
}

function resolveInterfaceTypeDefinition(
  path: string[],
  definition: InterfaceTypeDefinitionNode,
): Node {
  const [fieldName, argName] = path;

  if (fieldName) {
    return resolveFieldDefinition([fieldName, argName], definition);
  }

  return definition;
}

function resolveInputObjectTypeDefinition(
  path: string[],
  definition: InputObjectTypeDefinitionNode,
): Node {
  const [fieldName] = path;

  if (fieldName) {
    return resolveFieldDefinition([fieldName], definition);
  }

  return definition;
}

function resolveEnumTypeDefinition(path: string[], definition: EnumTypeDefinitionNode): Node {
  const [valueName] = path;

  if (definition.values && valueName) {
    const value = definition.values.find(val => val.name.value === valueName);

    if (value) {
      return value;
    }
  }

  return definition;
}

function resolveObjectTypeDefinition(path: string[], definition: ObjectTypeDefinitionNode): Node {
  const [fieldName, argName] = path;

  if (fieldName) {
    return resolveFieldDefinition([fieldName, argName], definition);
  }

  return definition;
}

function resolveDirectiveDefinition(path: string[], defininition: DirectiveDefinitionNode): Node {
  const [argName] = path;

  if (defininition.arguments && argName) {
    const arg = defininition.arguments.find(arg => arg.name.value === argName);

    if (arg) {
      return arg;
    }
  }

  return defininition;
}

function resolveNodeSourceLocation(source: Source, node: Node): SourceLocation {
  if (!node?.loc) {
    return {
      line: 1,
      column: 1,
    };
  }

  const nodeLocation = getLocation(source, node.loc.start);

  if (node.description?.loc) {
    return {
      line: getLocation(source, node.description.loc.end).line + 1,
      column: nodeLocation.column,
    };
  }

  return nodeLocation;
}
