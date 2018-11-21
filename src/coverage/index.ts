import {
  GraphQLSchema,
  GraphQLError,
  Source,
  isObjectType,
  visit,
  visitWithTypeInfo,
  TypeInfo,
  Visitor,
  GraphQLNamedType,
} from 'graphql';

import {readDocument} from '../ast/document';
import {isForIntrospection, isPrimitive} from '../utils/graphql';

export interface TypeChildCoverage {
  hits: number;
}

export interface TypeCoverage {
  hits: number;
  type: GraphQLNamedType;
  children: {
    [name: string]: TypeChildCoverage;
  };
}

export interface SchemaCoverage {
  [typename: string]: TypeCoverage;
}

export interface InvalidDocument {
  source: Source;
  errors: ReadonlyArray<GraphQLError>;
}

export function coverage(
  schema: GraphQLSchema,
  sources: Source[],
): SchemaCoverage {
  const coverage: SchemaCoverage = {};
  const typeMap = schema.getTypeMap();
  const typeInfo = new TypeInfo(schema);
  const visitor: Visitor<any, any> = {
    Field() {
      const fieldDef = typeInfo.getFieldDef();
      const parent = typeInfo.getParentType();

      if (parent && fieldDef) {
        coverage[parent.name].hits++;
        coverage[parent.name].children[fieldDef.name].hits++;
      }
    },
  };

  for (const typename in typeMap) {
    if (!isForIntrospection(typename) && !isPrimitive(typename)) {
      const type = typeMap[typename];

      if (isObjectType(type)) {
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
          };
        }

        coverage[type.name] = typeCoverage;
      }
    }
  }

  const documents = sources.map(readDocument);

  documents.forEach(doc => {
    doc.operations.forEach(op => {
      visit(op.node, visitWithTypeInfo(typeInfo, visitor));
    });
    doc.fragments.forEach(fr => {
      visit(fr.node, visitWithTypeInfo(typeInfo, visitor));
    });
  });

  return coverage;
}
