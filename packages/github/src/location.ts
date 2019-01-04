import {
  GraphQLSchema,
  printSchema,
  isObjectType,
  isDirective,
  isEnumType,
  isInputObjectType,
  Location,
  Source,
  getLocation as graphqlGetLocation,
} from 'graphql';

export function getLocation({
  path,
  schema,
}: {
  path: string;
  schema: GraphQLSchema;
}) {
  const printed = printSchema(schema);
  const loc = getNodeLocation({path, schema});
  const source = new Source(printed);

  if (!loc) {
    return {
      line: 1,
      column: 1,
    };
  }

  return graphqlGetLocation(source, loc.start);
}

function getNodeLocation({
  path,
  schema,
}: {
  path: string;
  schema: GraphQLSchema;
}): Location | undefined {
  const [typeName, ...rest] = path.split('.');
  const type = typeName.startsWith('@')
    ? schema.getDirective(typeName.substring(1))!
    : schema.getType(typeName)!;

  if (isObjectType(type)) {
    // type.field.arg
    const [fieldName, argName] = rest;

    if (fieldName) {
      const field = type.getFields()[fieldName];

      if (argName) {
        const arg = field.args.find(a => a.name === argName)!;

        // type.field.arg
        return arg.astNode!.loc;
      }

      // type.field
      return field.astNode!.loc;
    }

    // type
    return type.astNode!.loc;
  } else if (isDirective(type)) {
    // directive.arg
    const [argName] = rest;

    if (argName) {
      const arg = type.args.find(a => a.name === argName)!;

      // directive.arg
      return arg.astNode!.loc;
    }

    // directive
    return type.astNode!.loc;
  } else if (isEnumType(type)) {
    // enum.value
    const [valueName] = rest;

    if (valueName) {
      const val = type.getValue(valueName)!;

      // enum.value
      return val.astNode!.loc;
    }

    // enum
    return type.astNode!.loc;
  } else if (isInputObjectType(type)) {
    // input.field
    const [fieldName] = rest;

    if (fieldName) {
      const field = type.getFields()[fieldName]!;

      // input.field
      return field.astNode!.loc;
    }

    // input
    return type.astNode!.loc;
  } else {
    // name
    return type.astNode!.loc;
  }
}
