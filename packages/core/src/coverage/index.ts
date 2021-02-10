import {
  GraphQLSchema,
  GraphQLError,
  Source,
  isInterfaceType,
  isObjectType,
  visit,
  visitWithTypeInfo,
  TypeInfo,
  Visitor,
  GraphQLNamedType,
} from 'graphql';

import {readDocument} from '../ast/document';
import {isForIntrospection, isPrimitive} from '../utils/graphql';

export interface Location {
  start: number;
  end: number;
}

export interface TypeChildCoverage {
  hits: number;
  locations: {
    [name: string]: Array<Location>;
  };
}

export interface TypeCoverage {
  hits: number;
  type: GraphQLNamedType;
  children: {
    [name: string]: TypeChildCoverage;
  };
}

export interface SchemaCoverage {
  sources: Source[];
  types: {
    [typename: string]: TypeCoverage;
  };
}

export interface InvalidDocument {
  source: Source;
  errors: ReadonlyArray<GraphQLError>;
}

export function coverage(
  schema: GraphQLSchema,
  sources: Source[],
): SchemaCoverage {
  const coverage: SchemaCoverage = {
    sources,
    types: {},
  };
  const typeMap = schema.getTypeMap();
  const typeInfo = new TypeInfo(schema);
  const visitor: (source: Source) => Visitor<any, any> = (source) => ({
    Field(node) {
      const fieldDef = typeInfo.getFieldDef();
      const parent = typeInfo.getParentType();

      if (
        parent &&
        parent.name &&
        !isForIntrospection(parent.name) &&
        fieldDef &&
        fieldDef.name &&
        fieldDef.name !== '__typename' &&
        fieldDef.name !== '__schema'
      ) {
        const locations =
          coverage.types[parent.name].children[fieldDef.name].locations[
            source.name
          ];
        coverage.types[parent.name].hits++;
        coverage.types[parent.name].children[fieldDef.name].locations[
          source.name
        ] = [node.loc].concat(locations || []);
        coverage.types[parent.name].children[fieldDef.name].hits++;
      }
    },
  });

  for (const typename in typeMap) {
    if (!isForIntrospection(typename) && !isPrimitive(typename)) {
      const type = typeMap[typename];

      if (isObjectType(type) || isInterfaceType(type)) {
        const typeCoverage: TypeCoverage = {
          hits: 0,
          type,
          children: {},
        };
        const fieldMap = type.getFields();

        for (const fieldname in fieldMap) {
          const field = fieldMap[fieldname];

          typeCoverage.children[field.name] = {
            hits: 0,
            locations: {},
          };
        }

        coverage.types[type.name] = typeCoverage;
      }
    }
  }

  const documents = coverage.sources.map(readDocument);

  documents.forEach((doc, i) => {
    const source = coverage.sources[i];
    doc.operations.forEach((op) => {
      visit(op.node, visitWithTypeInfo(typeInfo, visitor(source)));
    });
    doc.fragments.forEach((fr) => {
      visit(fr.node, visitWithTypeInfo(typeInfo, visitor(source)));
    });
  });

  return coverage;
}
