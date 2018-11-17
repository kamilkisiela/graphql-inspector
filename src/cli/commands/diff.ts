import chalk from 'chalk';
import * as logSymbols from 'log-symbols';

import {loadSchema} from '../loaders/schema';
import {diff as diffSchema} from '../../diff/schema';
import {renderChange, Renderer, ConsoleRenderer} from '../render';
import {Change, CriticalityLevel} from '../../changes/change';

function hasBreaking(changes: Change[]): boolean {
  return changes.some(c => c.criticality.level === CriticalityLevel.Breaking);
}

export async function diff(
  oldSchemaPointer: string,
  newSchemaPointer: string,
  options?: {
    renderer?: Renderer;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();

  try {
    const oldSchema = await loadSchema(oldSchemaPointer);
    const newSchema = await loadSchema(newSchemaPointer);

    const changes = diffSchema(oldSchema, newSchema);

    if (!changes.length) {
      renderer.emit(
        logSymbols.success,
        chalk.greenBright('No changes detected'),
      );
    } else {
      renderer.emit(
        `\nDetected the following changes (${
          changes.length
        }) between schemas:\n`,
      );

      changes.forEach(change => {
        renderer.emit(...renderChange(change));
      });

      if (hasBreaking(changes)) {
        const breakingCount = changes.filter(
          c => c.criticality.level === CriticalityLevel.Breaking,
        ).length;

        renderer.emit(
          chalk.redBright(
            `\nDetected ${breakingCount} breaking change${
              breakingCount > 1 ? 's' : ''
            }\n`,
          ),
        );
        process.exit(1);
      } else {
        renderer.emit(chalk.greenBright('\nNo breaking changes detected\n'));
      }
    }
  } catch (e) {
    renderer.emit(logSymbols.error, chalk.redBright(e.message || e));
    process.exit(1);
  }

  process.exit(0);
}
