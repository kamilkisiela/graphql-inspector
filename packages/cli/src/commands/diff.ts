import {
  diff as diffSchema,
  DiffRule,
  Change,
  CriticalityLevel,
} from '@graphql-inspector/core';
import {loadSchema} from '@graphql-inspector/load';
import * as phin from 'phin';

import {renderChange, Renderer, ConsoleRenderer} from '../render';

function hasBreaking(changes: Change[]): boolean {
  return changes.some(c => c.criticality.level === CriticalityLevel.Breaking);
}

export async function diff(
  oldSchemaPointer: string,
  newSchemaPointer: string,
  options: {
    token?: string;
    renderer?: Renderer;
    require?: string[];
    rule?: Array<keyof typeof DiffRule>;
    headers?: Record<string, string>;
    tracingEndpoint?: string;
    tracingPeriod?: string;
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
          .map(rule => {
            if (!DiffRule[rule]) {
              renderer.error(`\Rule '${rule}' does not exist!\n`);
              process.exit(1);
            }

            return DiffRule[rule];
          })
          .filter(f => f)
      : [];

    const considerUsage =
      (options.rule && options.rule.includes('considerUsage')) || false;
    const changes = await diffSchema(
      oldSchema,
      newSchema,
      rules,
      considerUsage
        ? {
            async checkUsage({type, field}) {
              const response = await phin({
                url: options.tracingEndpoint!,
                parse: 'json',
                method: 'POST',
                data: {
                  operationName: 'usageInInspectorDiffCLI',
                  query: `query usageInInspectorDiffCLI($type: String!, $field: String!, $period: String) { usage(input: { field: $field, type: $type, period: $period }) { count percentage } }`,
                  variables: {
                    type,
                    field,
                    period: options.tracingPeriod,
                  },
                },
              });

              if (response.body.errors && response.body.errors.length) {
                throw new Error(`Failed to fetch usage of ${type}.${field}`);
              }

              return response.body.data.usage;
            },
          }
        : undefined,
    );

    if (!changes.length) {
      renderer.success('No changes detected');
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
