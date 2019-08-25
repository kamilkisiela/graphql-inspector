import {
  diff as diffSchemas,
  CriticalityLevel,
  Change,
  DiffRule,
} from '@graphql-inspector/core';
import {GraphQLSchema} from 'graphql';
import * as phin from 'phin';

import {
  CheckConclusion,
  ActionResult,
  Annotation,
  AnnotationLevel,
} from './types';
import {getLocation} from './location';
import {TracingConfig} from './probot';

export async function diff({
  path,
  schemas,
  tracing,
}: {
  path: string;
  schemas: {
    old: GraphQLSchema;
    new: GraphQLSchema;
  };
  tracing?: TracingConfig;
}): Promise<ActionResult> {
  const useTracing = !!tracing;
  const changes = await diffSchemas(
    schemas.old,
    schemas.new,
    useTracing ? [DiffRule.considerUsage] : [],
    useTracing
      ? {
          async checkUsage({type, field}) {
            const response = await phin({
              url: tracing!.endpoint!,
              parse: 'json',
              method: 'POST',
              data: {
                operationName: 'usageInInspectorDiffCLI',
                query: /* GraphQL */ `
                  query usageInInspectorDiffCLI(
                    $type: String!
                    $field: String!
                    $period: String
                  ) {
                    usage(
                      input: {field: $field, type: $type, period: $period}
                    ) {
                      count {
                        max
                      }
                      percentage {
                        max
                      }
                    }
                  }
                `,
                variables: {
                  type,
                  field,
                  period: tracing!.period,
                },
              },
            });

            if (response.body.errors && response.body.errors.length) {
              throw new Error(`Failed to fetch usage of ${type}.${field}`);
            }

            const usage: {
              count: {
                max: number;
              };
              percentage: {
                max: number;
              };
            } = response.body.data.usage;

            console.log(usage);

            if (tracing!.count) {
              return usage.count.max < tracing!.count;
            }

            if (tracing!.percentage) {
              return usage.percentage.max < tracing!.percentage;
            }

            return usage.count.max === 0;
          },
        }
      : undefined,
  );

  if (!changes || !changes.length) {
    return {
      conclusion: CheckConclusion.Success,
    };
  }

  const annotations = await Promise.all(
    changes.map(change => annotate({path, change, schemas})),
  );
  let conclusion: CheckConclusion = CheckConclusion.Success;

  if (
    changes.some(
      change => change.criticality.level === CriticalityLevel.Breaking,
    )
  ) {
    conclusion = CheckConclusion.Failure;
  }

  return {
    conclusion,
    annotations,
  };
}

const levelMap = {
  [CriticalityLevel.Breaking]: AnnotationLevel.Failure,
  [CriticalityLevel.Dangerous]: AnnotationLevel.Warning,
  [CriticalityLevel.NonBreaking]: AnnotationLevel.Notice,
};

function annotate({
  path,
  change,
  schemas,
}: {
  path: string;
  change: Change;
  schemas: {
    old: GraphQLSchema;
    new: GraphQLSchema;
  };
}): Annotation {
  const level = change.criticality.level;
  const schema = change.type.endsWith('_REMOVED') ? schemas.old : schemas.new;
  const loc = change.path
    ? getLocation({path: change.path, schema})
    : {line: 1, column: 1};

  return {
    title: change.message,
    annotation_level: levelMap[level],
    path,
    message: change.criticality.reason || change.message,
    start_line: loc.line,
    end_line: loc.line,
  };
}
