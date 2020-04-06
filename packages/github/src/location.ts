import {
  Location,
  Source,
  getLocation as graphqlGetLocation,
  Kind,
  parse,
  ObjectTypeDefinitionNode,
  DirectiveDefinitionNode,
  EnumTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  UnionTypeDefinitionNode,
  ScalarTypeDefinitionNode,
} from 'graphql';

export function getLocation({path, source}: {path: string; source: Source}) {
  const foundLoc = getNodeLocation({
    path,
    source,
  });

  if (!foundLoc) {
    return {
      line: 1,
      column: 1,
    };
  }

  const loc = graphqlGetLocation(source, foundLoc.start);
  const commentedLines = countCommentsUntilLine(source, loc.line);

  // I have no idea why... but it seems like offset is correct when Source contain comments
  // If there are no comments, it adds one line, so we arrive a bit too far :)
  const offset = commentedLines
    ? commentedLines + source.locationOffset.line
    : 0;

  return {
    line: loc.line + offset,
    column: loc.column,
  };
}

function getNodeLocation({
  path,
  source,
}: {
  path: string;
  source: Source;
}): Location | undefined {
  const [typeName, ...rest] = path.split('.');
  const isDirective = typeName.startsWith('@');

  const doc = parse(source);

  for (const definition of doc.definitions) {
    if (
      definition.kind === Kind.OBJECT_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      return resolveObjectTypeDefinition(rest, definition);
    }

    if (
      isDirective &&
      definition.kind === Kind.DIRECTIVE_DEFINITION &&
      definition.name.value === typeName.substring(1)
    ) {
      return resolveDirectiveDefinition(rest, definition);
    }

    if (
      definition.kind === Kind.ENUM_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      return resolveEnumTypeDefinition(rest, definition);
    }

    if (
      definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      return resolveInputObjectTypeDefinition(rest, definition);
    }

    if (
      definition.kind === Kind.INTERFACE_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      return resolveInterfaceTypeDefinition(rest, definition);
    }

    if (
      definition.kind === Kind.UNION_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      return resolveUnionTypeDefinitionNode(rest, definition);
    }

    if (
      definition.kind === Kind.SCALAR_TYPE_DEFINITION &&
      definition.name.value === typeName
    ) {
      return resolveScalarTypeDefinitionNode(rest, definition);
    }
  }
}

function countCommentsUntilLine(source: Source, end: number): number {
  const lines = source.body.split('\n');
  let count = 0;
  let i = 0;

  while (i < end + count) {
    if (lines[i].trimLeft().startsWith('#')) {
      count++;
    }

    i++;
  }

  return count;
}

function resolveScalarTypeDefinitionNode(
  _path: string[],
  definition: ScalarTypeDefinitionNode,
): Location | undefined {
  return definition.loc;
}

function resolveUnionTypeDefinitionNode(
  _path: string[],
  definition: UnionTypeDefinitionNode,
): Location | undefined {
  return definition.loc;
}

function resolveInterfaceTypeDefinition(
  path: string[],
  definition: InterfaceTypeDefinitionNode,
): Location | undefined {
  const [fieldName, argName] = path;

  if (!fieldName) {
    console.log(definition);
    return definition.loc;
  }

  const field = definition.fields!.find((f) => f.name.value === fieldName)!;

  if (!argName) {
    return field.loc;
  }

  return field.arguments!.find((arg) => arg.name.value === argName)?.loc;
}

function resolveInputObjectTypeDefinition(
  path: string[],
  definition: InputObjectTypeDefinitionNode,
): Location | undefined {
  const [fieldName] = path;

  if (!fieldName) {
    return definition.loc;
  }

  const field = definition.fields!.find((field) => field.name.value)!;

  return field.loc;
}

function resolveEnumTypeDefinition(
  path: string[],
  definition: EnumTypeDefinitionNode,
): Location | undefined {
  const [valueName] = path;

  if (!valueName) {
    return definition.loc;
  }

  const val = definition.values!.find((val) => val.name.value === valueName)!;

  return val.loc;
}

function resolveObjectTypeDefinition(
  path: string[],
  definition: ObjectTypeDefinitionNode,
): Location | undefined {
  const [fieldName, argName] = path;

  if (!fieldName) {
    return definition.loc;
  }

  const field = definition.fields!.find((f) => f.name.value === fieldName)!;

  if (!argName) {
    return field.loc;
  }

  return field.arguments!.find((arg) => arg.name.value === argName)?.loc;
}

function resolveDirectiveDefinition(
  path: string[],
  defininition: DirectiveDefinitionNode,
): Location | undefined {
  const [argName] = path;

  if (!argName) {
    return defininition.loc;
  }

  const arg = defininition.arguments!.find(
    (arg) => arg.name.value === argName,
  )!;

  return arg.loc;
}
