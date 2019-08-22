import {DocumentNode} from 'graphql';
import {
  printWithReducedWhitespace,
  sortAST,
  removeAliases,
  hideLiterals,
  dropUnusedDefinitions,
} from 'apollo-graphql/lib/transforms';

export function operationSignature({
  document,
  operationName,
}: {
  document: string;
  operationName: string;
}): string {
  return `# ${operationName} \n ${document}`;
}

export function normalizeOperation({
  document,
  operationName,
}: {
  document: DocumentNode;
  operationName: string;
}): string {
  return printWithReducedWhitespace(
    sortAST(
      removeAliases(
        hideLiterals(dropUnusedDefinitions(document, operationName)),
      ),
    ),
  );
}
