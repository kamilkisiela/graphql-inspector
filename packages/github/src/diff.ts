import {
  diff as diffSchemas,
  CriticalityLevel,
  Change,
} from '@graphql-inspector/core';
import {GraphQLSchema} from 'graphql';

import {
  CheckConclusion,
  ActionResult,
  Annotation,
  AnnotationLevel,
} from './types';
import {getLocation} from './location';

export async function diff({
  path,
  schemas,
}: {
  path: string;
  schemas: {
    old: GraphQLSchema;
    new: GraphQLSchema;
  };
}): Promise<ActionResult> {
  const changes = await diffSchemas(schemas.old, schemas.new);

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
