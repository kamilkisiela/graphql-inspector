import {
  GraphQLSchema,
  GraphQLError,
  Source,
  print,
  parse,
  validate as validateDocument,
  FragmentDefinitionNode,
} from 'graphql';

import {readDocument} from '../ast/document';
import {findDeprecatedUsages} from '../utils/graphql';

export interface InvalidDocument {
  source: Source;
  errors: GraphQLError[];
  deprecated: GraphQLError[];
}

export function validate(
  schema: GraphQLSchema,
  sources: Source[],
): InvalidDocument[] {
  const invalidDocuments: InvalidDocument[] = [];
  // read documents
  const documents = sources.map(readDocument);
  // keep all named fragments
  const fragments: FragmentDefinitionNode[] = [];

  documents.forEach(doc => {
    doc.fragments.forEach(fragment => {
      fragments.push(fragment.node);
    });
  });

  documents.forEach(doc => {
    const errors = validateDocument(
      schema,
      // all fragments next to an operation? Stuuuupid
      // but should be enough for now
      parse(`
          ${doc.source.body}

          ${fragments.map(print).join('\n\n')}
        `),
    ) as GraphQLError[];
    const deprecated = findDeprecatedUsages(schema, parse(doc.source.body));

    if (errors || deprecated) {
      invalidDocuments.push({
        source: doc.source,
        errors,
        deprecated,
      });
    }
  });

  return invalidDocuments;
}
