import {
  validate as validateDocuments,
  InvalidDocument,
} from '@graphql-inspector/core';
import {loadSchema, loadDocuments} from '@graphql-inspector/load';

import {
  Renderer,
  ConsoleRenderer,
  renderInvalidDocument,
  renderDeprecatedUsageInDocument,
} from '../render';

export async function validate(
  documentsPointer: string,
  schemaPointer: string,
  options: {
    require: string[];
    deprecated: boolean;
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
      const errors = countErrors(invalidDocuments);
      const deprecated = countDeprecated(invalidDocuments);

      if (errors) {
        renderer.emit(
          `\nDetected ${errors} invalid document${errors > 1 ? 's' : ''}:\n`,
        );

        invalidDocuments.forEach(doc => {
          renderer.emit(...renderInvalidDocument(doc));
        });
      } else if (!options.deprecated) {
        renderer.success('All documents are valid');
      }

      if (deprecated) {
        renderer.emit(
          `\nDetected ${deprecated} document${
            deprecated > 1 ? 's' : ''
          } with deprecated fields:\n`,
        );

        invalidDocuments.forEach(doc => {
          renderer.emit(
            ...renderDeprecatedUsageInDocument(doc, options.deprecated),
          );
        });
      }

      if (errors || (deprecated && options.deprecated)) {
        process.exit(1);
      }
    }
  } catch (e) {
    renderer.error(e.message || e);
    process.exit(1);
  }

  process.exit(0);
}

function countErrors(invalidDocuments: InvalidDocument[]): number {
  if (invalidDocuments.length) {
    return invalidDocuments.filter(doc => doc.errors && doc.errors.length)
      .length;
  }

  return 0;
}

function countDeprecated(invalidDocuments: InvalidDocument[]): number {
  if (invalidDocuments.length) {
    return invalidDocuments.filter(
      doc => doc.deprecated && doc.deprecated.length,
    ).length;
  }

  return 0;
}
