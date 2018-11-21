import * as isValidPath from 'is-valid-path';

import {loadSchema} from '../loaders/schema';
import {loadDocuments} from '../loaders/documents';
import {Renderer, ConsoleRenderer} from '../render';
import {coverage as calculateCoverage} from '../../coverage';
import {writeFileSync} from 'fs';
import {ensureAbsolute} from '../../utils/fs';

export async function coverage(
  documentsPointer: string,
  schemaPointer: string,
  options: {
    require: string[];
    write?: string;
    silent?: boolean;
    renderer?: Renderer;
  },
) {
  const renderer = options.renderer || new ConsoleRenderer();
  const silent = options.silent === true;
  const writePath = options.write;
  const shouldWrite = typeof writePath !== 'undefined';

  try {
    const schema = await loadSchema(schemaPointer);
    const documents = await loadDocuments(documentsPointer);
    const coverage = calculateCoverage(schema, documents);

    if (!silent) {
      renderer.coverage(coverage);
    }

    if (shouldWrite) {
      if (typeof writePath !== 'string' || !isValidPath(writePath)) {
        throw new Error(`--write is not valid file path: ${writePath}`);
      }

      const absPath = ensureAbsolute(writePath);

      writeFileSync(absPath, JSON.stringify(coverage, null, 2), {
        encoding: 'utf-8',
      });

      renderer.success('Available at', absPath, '\n');
    }
  } catch (e) {
    console.log(e);
    renderer.error(e);
    process.exit(1);
  }

  process.exit(0);
}
