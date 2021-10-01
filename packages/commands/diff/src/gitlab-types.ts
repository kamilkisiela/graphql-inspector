// Source code traces not implemented: https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md#source-code-traces
export interface GitLabCodeClimateIssueType {
  type: 'issue';
  check_name: string;
  description: string;
  content?: string;
  categories: Array<IssueType>;
  location: Location;
  other_locations?: Array<Location>;
  severity?: Severity;
  fingerprint?: string;
}

export enum IssueType {
  BUG_RISK = 'Bug Risk',
  CLARITY = 'Clarity',
  COMPATIBILITY = 'Compatibilty',
  COMPLEXITY = 'Complexity',
  DUPLICATION = 'Duplication',
  PERFORMANCE = 'Performance',
  SECURITY = 'Security',
  STYLE = 'Style',
}

export enum Severity {
  INFO = 'info',
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical',
  BLOCKER = 'blocker',
}

export interface Location {
  path: String;
  lines?: Lines;
  positions?: BeginEnd;
}

export interface Lines {
  begin: number;
  end: number;
}

export interface BeginEnd {
  begin: Position;
  end: Position;
}

export type Position = LineColumnPosition | OffsetPosition;

export interface LineColumnPosition {
  line: number;
  column: number;
}

export interface OffsetPosition {
  offset: number;
}
