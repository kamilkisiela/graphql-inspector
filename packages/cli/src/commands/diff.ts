import {
  diff as diffSchema,
  DiffRule,
  Change,
  CriticalityLevel,
  Rule,
} from '@graphql-inspector/core';

import {loadSchema} from '@graphql-inspector/load';
import {existsSync} from 'fs';
import {join, isAbsolute} from 'path';

import {renderChange, Renderer, ConsoleRenderer} from '../render';

function hasBreaking(changes: Change[]): boolean {
  return changes.some(c => c.criticality.level === CriticalityLevel.Breaking);
}

function resolveRule(name: string): Rule | undefined {
  const filepath = isAbsolute(name) ? name : join(process.cwd(), name);
  if (existsSync(filepath)) {
    return require(filepath);
  }

  return DiffRule[name as keyof typeof DiffRule];
}

export async function diff(
  oldSchemaPointer: string,
  newSchemaPointer: string,
  options: {
    token?: string;
    renderer?: Renderer;
    require?: string[];
    rule?: Array<string>;
    headers?: Record<string, string>;
  },
) {
  const renderer = (options && options.renderer) || new ConsoleRenderer();

  try {
    const oldSchema = await loadSchema(oldSchemaPointer, {
      token: options.token,
      headers: options.headers,
    });
    const newSchema = await loadSchema(newSchemaPointer, {
      token: options.token,
      headers: options.headers,
    });
    const rules = options.rule
      ? options.rule
          .map(
            (name): Rule => {
              const rule = resolveRule(name);

              if (!rule) {
                renderer.error(`\Rule '${name}' does not exist!\n`);
                return process.exit(1);
              }

              return rule;
            },
          )
          .filter(f => f)
      : [];
    const changes = diffSchema(oldSchema, newSchema, rules);

    if (!changes.length) {
      renderer.success('No changes detected');
    } else {
      renderer.emit(
        `\nDetected the following changes (${changes.length}) between schemas:\n`,
      );

      changes.forEach(change => {
        renderer.emit(...renderChange(change));
      });

      if (hasBreaking(changes)) {
        const breakingCount = changes.filter(
          c => c.criticality.level === CriticalityLevel.Breaking,
        ).length;

        renderer.error(
          `Detected ${breakingCount} breaking change${
            breakingCount > 1 ? 's' : ''
          }\n`,
        );
        process.exit(1);
      } else {
        renderer.success('No breaking changes detected\n');
      }
    }
  } catch (e) {
    renderer.error(e.message || e);
    process.exit(1);
  }

  process.exit(0);
}
