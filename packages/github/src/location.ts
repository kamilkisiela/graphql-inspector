import {
  Source,
  SourceLocation,
  getLocation,
  Kind,
  parse,
  ObjectTypeDefinitionNode,
  DirectiveDefinitionNode,
  EnumTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  UnionTypeDefinitionNode,
  ScalarTypeDefinitionNode,
  TypeDefinitionNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  EnumValueDefinitionNode,
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
    if (
      definition.kind === Kind.OBJECT_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
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

    if (
      definition.kind === Kind.ENUM_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
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

    if (
      definition.kind === Kind.INTERFACE_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      resolvedNode = resolveInterfaceTypeDefinition(rest, definition);
      break;
    }

    if (
      definition.kind === Kind.UNION_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      resolvedNode = resolveUnionTypeDefinitionNode(rest, definition);
      break;
    }

    if (
      definition.kind === Kind.SCALAR_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      resolvedNode = resolveScalarTypeDefinitionNode(rest, definition);
      break;
    }
  }

  return resolveNodeSourceLocation(source, resolvedNode);;
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

function resolveInterfaceTypeDefinition(
  path: string[],
  definition: InterfaceTypeDefinitionNode,
): Node {
  const [fieldName, argName] = path;

  if (!fieldName) {
    return definition;
  }

  const field = definition.fields!.find((f) => f.name.value === fieldName)!;

  if (!argName) {
    return field;
  }

  return field.arguments!.find((arg) => arg.name.value === argName);
}

function resolveInputObjectTypeDefinition(
  path: string[],
  definition: InputObjectTypeDefinitionNode,
): Node {
  const [fieldName] = path;

  if (!fieldName) {
    return definition;
  }

  const field = definition.fields!.find((field) => field.name.value)!;

  return field;
}

function resolveEnumTypeDefinition(
  path: string[],
  definition: EnumTypeDefinitionNode,
): Node {
  const [valueName] = path;

  if (!valueName) {
    return definition;
  }

  return definition.values!.find((val) => val.name.value === valueName);
}

function resolveObjectTypeDefinition(
  path: string[],
  definition: ObjectTypeDefinitionNode,
): Node {
  const [fieldName, argName] = path;

  if (!fieldName) {
    return definition;
  }

  const field = definition.fields!.find((f) => f.name.value === fieldName)!;

  if (!argName) {
    return field;
  }

  return field.arguments!.find((arg) => arg.name.value === argName);
}

function resolveDirectiveDefinition(
  path: string[],
  defininition: DirectiveDefinitionNode,
): Node {
  const [argName] = path;

  if (!argName) {
    return defininition;
  }

  const arg = defininition.arguments!.find(
    (arg) => arg.name.value === argName,
  )!;

  return arg;
}

function resolveNodeSourceLocation(source: Source, node: Node): SourceLocation {
  if (!node || !node.loc) {
    return {
      line: 1,
      column: 1,
    };
  }

  const nodeLocation = getLocation(source, node.loc.start);

  if (node.description && node.description.loc) {
    return {
      line: getLocation(source, node.description.loc.end).line + 1,
      column: nodeLocation.column,
    };
  }

  return nodeLocation;
}
