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

export interface InvalidDocument {
  source: Source;
  errors: ReadonlyArray<GraphQLError>;
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
    );

    if (errors) {
      invalidDocuments.push({
        source: doc.source,
        errors,
      });
    }
  });

  return invalidDocuments;
}
