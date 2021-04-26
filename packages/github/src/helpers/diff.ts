import {
  diff as diffSchemas,
  CriticalityLevel,
  Change,
} from '@graphql-inspector/core';
import {GraphQLSchema, Source} from 'graphql';
import axios from 'axios';

import {
  CheckConclusion,
  ActionResult,
  Annotation,
  AnnotationLevel,
  PullRequest,
} from './types';
import {getLocationByPath} from './location';
import {parseEndpoint, isNil} from './utils';

export type DiffInterceptor =
  | string
  | {
      url: string;
      headers?: {
        [header: string]: string;
      };
    };

export interface DiffInterceptorPayload {
  pullRequests?: PullRequest[];
  ref?: string;
  changes: Change[];
}

export type DiffInterceptorResponse = {
  changes: Change[];
  conclusion?: CheckConclusion;
};

export async function diff({
  path,
  schemas,
  sources,
  interceptor,
  pullRequests,
  ref,
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
  interceptor?: DiffInterceptor;
  pullRequests?: PullRequest[];
  ref?: string;
}): Promise<ActionResult> {
  let changes = await diffSchemas(schemas.old, schemas.new);
  let forcedConclusion: CheckConclusion | null = null;

  if (!changes || !changes.length) {
    return {
      conclusion: CheckConclusion.Success,
    };
  }

  if (!isNil(interceptor)) {
    const interceptionResult = await interceptChanges(interceptor, {
      pullRequests,
      ref,
      changes,
    });

    changes = interceptionResult.changes || [];
    forcedConclusion = interceptionResult.conclusion || null;
  }

  const annotations = await Promise.all(
    changes.map((change) => annotate({path, change, source: sources.new})),
  );
  let conclusion: CheckConclusion = CheckConclusion.Success;

  if (
    changes.some(
      (change) => change.criticality.level === CriticalityLevel.Breaking,
    )
  ) {
    conclusion = CheckConclusion.Failure;
  }

  if (forcedConclusion) {
    conclusion = forcedConclusion;
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
  source,
}: {
  path: string;
  change: Change;
  source: Source;
}): Annotation {
  const level = change.criticality.level;
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

async function interceptChanges(
  interceptor: DiffInterceptor,
  payload: DiffInterceptorPayload,
): Promise<DiffInterceptorResponse> {
  const endpoint = parseEndpoint(interceptor);

  const {data} = await axios.request({
    url: endpoint.url,
    method: endpoint.method,
    data: payload,
  });

  return data;
}
