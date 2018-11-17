import chalk from 'chalk';
import * as logSymbols from 'log-symbols';

import {loadSchema} from '../loaders/schema';
import {renderChange, Renderer, ConsoleRenderer} from '../render';

export async function check(
  documentsPointer: string,
  schemaPointer: string,
  options?: {
    renderer?: Renderer;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();

  try {
    // const oldSchema = await loadSchema(oldSchemaPointer);
    // const newSchema = await loadSchema(newSchemaPointer);

    // const changes = diffSchema(oldSchema, newSchema);

    // if (!changes.length) {
    //   renderer.emit(
    //     logSymbols.success,
    //     chalk.greenBright('No changes detected'),
    //   );
    // } else {
    //   renderer.emit(
    //     `\nDetected the following changes (${
    //       changes.length
    //     }) between schemas:\n`,
    //   );

    //   changes.forEach(change => {
    //     renderer.emit(...renderChange(change));
    //   });

    //   if (hasBreaking(changes)) {
    //     renderer.emit(chalk.redBright('\nDetected some breaking changes\n'));
    //     process.exit(1);
    //   }
    // }
  } catch (e) {
    renderer.emit(logSymbols.error, chalk.redBright(e.message || e));
    process.exit(1);
  }

  process.exit(0);
}
