import chalk from 'chalk';
import * as logSymbols from 'log-symbols';

import {loadSchema} from '../loaders/schema';
import {loadDocuments} from '../loaders/documents';
import {Renderer, ConsoleRenderer, renderInvalidDocument} from '../render';
import {validate as validateDocuments} from '../../validate';
import {useRequire} from '../utils/options';

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
    useRequire(options.require);
    const schema = await loadSchema(schemaPointer);
    const documents = await loadDocuments(documentsPointer);

    const invalidDocuments = validateDocuments(schema, documents);

    if (!invalidDocuments.length) {
      renderer.emit(
        logSymbols.success,
        chalk.greenBright('All documents are valid'),
      );
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
    renderer.emit(logSymbols.error, chalk.redBright(e.message || e));
    process.exit(1);
  }

  process.exit(0);
}
