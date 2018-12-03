import {validate as validateDocuments} from '@graphql-inspector/core';
import {loadSchema, loadDocuments} from '@graphql-inspector/load';

import {Renderer, ConsoleRenderer, renderInvalidDocument} from '../render';

export async function validate(
  documentsPointer: string,
  schemaPointer: string,
  options: {
    require: string[];
    renderer?: Renderer;
  },
) {
  const renderer = options.renderer || new ConsoleRenderer();

  try {
    const schema = await loadSchema(schemaPointer);
    const documents = await loadDocuments(documentsPointer);

    const invalidDocuments = validateDocuments(schema, documents);

    if (!invalidDocuments.length) {
      renderer.success('All documents are valid');
    } else {
      renderer.emit(
        `\nDetected ${invalidDocuments.length} invalid document${
          invalidDocuments.length > 1 ? 's' : ''
        }:\n`,
      );

      invalidDocuments.forEach(doc => {
        renderer.emit(...renderInvalidDocument(doc));
      });

      process.exit(1);
    }
  } catch (e) {
    renderer.error(e.message || e);
    process.exit(1);
  }

  process.exit(0);
}
