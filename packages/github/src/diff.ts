import {
  diff as diffSchemas,
  CriticalityLevel,
  Change,
} from '@graphql-inspector/core';
import {GraphQLSchema, Source} from 'graphql';

import {
  CheckConclusion,
  ActionResult,
  Annotation,
  AnnotationLevel,
} from './types';
import {getLocationByPath} from './location';

export async function diff({
  path,
  schemas,
  sources,
}: {
  path: string;
  schemas: {
    old: GraphQLSchema;
    new: GraphQLSchema;
  };
  sources: {
    old: Source;
    new: Source;
  };
}): Promise<ActionResult> {
  const changes = diffSchemas(schemas.old, schemas.new);

  if (!changes || !changes.length) {
    return {
      conclusion: CheckConclusion.Success,
    };
  }

  const annotations = await Promise.all(
    changes.map((change) => annotate({path, change, sources})),
  );
  let conclusion: CheckConclusion = CheckConclusion.Success;

  if (
    changes.some(
      (change) => change.criticality.level === CriticalityLevel.Breaking,
    )
  ) {
    conclusion = CheckConclusion.Failure;
  }

  return {
    conclusion,
    annotations,
    changes,
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
  sources,
}: {
  path: string;
  change: Change;
  sources: {
    old: Source;
    new: Source;
  };
}): Annotation {
  const level = change.criticality.level;
  const useOld = change.type.endsWith('_REMOVED');
  const source = useOld ? sources.old : sources.new;
  const loc = change.path
    ? getLocationByPath({path: change.path, source})
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
