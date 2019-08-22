import {SourceLocation} from 'graphql';
import {TraceNode} from './node';

export interface Metadata {
  agent: string;
  runtime: string;
  uname: string;
  hostname: string;
  schemaHash: string;
  schemaTag: string;
}

export interface Trace {
  id: string;
  operationName?: string;
  query?: string;

  // phases
  parsing?: number;
  validation?: number;
  execution?: number;

  startTime: number;
  duration: number;
  entry: TraceNode;
}

export interface Report {
  metadata: Metadata;
  traces: Trace[];
}

export interface TraceError {
  message: string;
  locations: ReadonlyArray<SourceLocation> | undefined;
  json: string;
}
