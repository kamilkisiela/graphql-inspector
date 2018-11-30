import * as core from '@graphql-inspector/core';

export enum CriticalityLevel {
  Breaking = 'BREAKING',
  NonBreaking = 'NON_BREAKING',
  Dangerous = 'DANGEROUS',
}

// ====================================================
// Types
// ====================================================

export interface Query {
  readonly ping: string;

  readonly coverage: SchemaCoverage;

  readonly diff?: ReadonlyArray<Change> | null;

  readonly validate?: ReadonlyArray<InvalidDocument> | null;

  readonly similar?: ReadonlyArray<Similar> | null;

  readonly similarTo: Similar;
}

export interface SchemaCoverage {
  readonly sources?: ReadonlyArray<DocumentSource> | null;

  readonly types?: ReadonlyArray<TypeCoverage> | null;
}

export interface DocumentSource {
  readonly body: string;

  readonly name: string;
}

export interface TypeCoverage {
  readonly name: string;

  readonly hits: number;

  readonly children?: ReadonlyArray<TypeChildCoverage> | null;
}

export interface TypeChildCoverage {
  readonly name: string;

  readonly hits: number;

  readonly locations?: ReadonlyArray<DocumentLocation> | null;
}

export interface DocumentLocation {
  readonly name: string;

  readonly locations?: ReadonlyArray<Location> | null;
}

export interface Location {
  readonly start: number;

  readonly end: number;
}

export interface Change {
  readonly message: string;

  readonly path?: string | null;

  readonly type: string;

  readonly criticality: Criticality;
}

export interface Criticality {
  readonly level: CriticalityLevel;

  readonly reason?: string | null;
}

export interface InvalidDocument {
  readonly source: DocumentSource;

  readonly errors?: ReadonlyArray<GraphQlError> | null;
}

export interface GraphQlError {
  /** A message describing the Error for debugging purposes. */
  readonly message: string;
  /** An array of { line, column } locations within the source GraphQL documentwhich correspond to this error.Errors during validation often contain multiple locations, for example topoint out two things with the same name. Errors during execution include asingle location, the field which produced the error. */
  readonly locations?: ReadonlyArray<SourceLocation> | null;
  /** An array of character offsets within the source GraphQL documentwhich correspond to this error. */
  readonly positions?: ReadonlyArray<number | null> | null;
}

export interface SourceLocation {
  readonly line: number;

  readonly column: number;
}

export interface Similar {
  readonly name: string;

  readonly best: Match;

  readonly types?: ReadonlyArray<Match> | null;
}

export interface Match {
  readonly name: string;

  readonly rating: number;
}

export interface Mutation {
  readonly ping: string;
}

// ====================================================
// Arguments
// ====================================================

export interface CoverageQueryArgs {
  schema: string;

  documents: string;
}
export interface DiffQueryArgs {
  oldSchema: string;

  newSchema: string;
}
export interface ValidateQueryArgs {
  schema: string;

  documents: string;
}
export interface SimilarQueryArgs {
  schema: string;

  threshold?: number | null;
}
export interface SimilarToQueryArgs {
  schema: string;

  name: string;

  threshold?: number | null;
}

import {GraphQLResolveInfo, GraphQLScalarTypeConfig} from 'graphql';

import {
  ResolvedTypeCoverage,
  ResolvedTypeChildCoverage,
  ResolvedDocumentLocation,
  ResolvedSimilar,
} from '../types';

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo,
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo,
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

type Maybe<T> = T | null | undefined;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo,
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    ping?: PingResolver<string, TypeParent, Context>;

    coverage?: CoverageResolver<core.SchemaCoverage, TypeParent, Context>;

    diff?: DiffResolver<ReadonlyArray<Change> | null, TypeParent, Context>;

    validate?: ValidateResolver<
      ReadonlyArray<InvalidDocument> | null,
      TypeParent,
      Context
    >;

    similar?: SimilarResolver<
      ReadonlyArray<ResolvedSimilar> | null,
      TypeParent,
      Context
    >;

    similarTo?: SimilarToResolver<ResolvedSimilar, TypeParent, Context>;
  }

  export type PingResolver<R = string, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type CoverageResolver<
    R = core.SchemaCoverage,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CoverageArgs>;
  export interface CoverageArgs {
    schema: string;

    documents: string;
  }

  export type DiffResolver<
    R = ReadonlyArray<Change> | null,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, DiffArgs>;
  export interface DiffArgs {
    oldSchema: string;

    newSchema: string;
  }

  export type ValidateResolver<
    R = ReadonlyArray<InvalidDocument> | null,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, ValidateArgs>;
  export interface ValidateArgs {
    schema: string;

    documents: string;
  }

  export type SimilarResolver<
    R = ReadonlyArray<ResolvedSimilar> | null,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, SimilarArgs>;
  export interface SimilarArgs {
    schema: string;

    threshold?: number | null;
  }

  export type SimilarToResolver<
    R = ResolvedSimilar,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, SimilarToArgs>;
  export interface SimilarToArgs {
    schema: string;

    name: string;

    threshold?: number | null;
  }
}

export namespace SchemaCoverageResolvers {
  export interface Resolvers<Context = {}, TypeParent = core.SchemaCoverage> {
    sources?: SourcesResolver<
      ReadonlyArray<DocumentSource> | null,
      TypeParent,
      Context
    >;

    types?: TypesResolver<
      ReadonlyArray<ResolvedTypeCoverage> | null,
      TypeParent,
      Context
    >;
  }

  export type SourcesResolver<
    R = ReadonlyArray<DocumentSource> | null,
    Parent = core.SchemaCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypesResolver<
    R = ReadonlyArray<ResolvedTypeCoverage> | null,
    Parent = core.SchemaCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace DocumentSourceResolvers {
  export interface Resolvers<Context = {}, TypeParent = DocumentSource> {
    body?: BodyResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;
  }

  export type BodyResolver<
    R = string,
    Parent = DocumentSource,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = DocumentSource,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace TypeCoverageResolvers {
  export interface Resolvers<Context = {}, TypeParent = ResolvedTypeCoverage> {
    name?: NameResolver<string, TypeParent, Context>;

    hits?: HitsResolver<number, TypeParent, Context>;

    children?: ChildrenResolver<
      ReadonlyArray<ResolvedTypeChildCoverage> | null,
      TypeParent,
      Context
    >;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedTypeCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HitsResolver<
    R = number,
    Parent = ResolvedTypeCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ChildrenResolver<
    R = ReadonlyArray<ResolvedTypeChildCoverage> | null,
    Parent = ResolvedTypeCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace TypeChildCoverageResolvers {
  export interface Resolvers<
    Context = {},
    TypeParent = ResolvedTypeChildCoverage
  > {
    name?: NameResolver<string, TypeParent, Context>;

    hits?: HitsResolver<number, TypeParent, Context>;

    locations?: LocationsResolver<
      ReadonlyArray<ResolvedDocumentLocation> | null,
      TypeParent,
      Context
    >;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedTypeChildCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type HitsResolver<
    R = number,
    Parent = ResolvedTypeChildCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LocationsResolver<
    R = ReadonlyArray<ResolvedDocumentLocation> | null,
    Parent = ResolvedTypeChildCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace DocumentLocationResolvers {
  export interface Resolvers<
    Context = {},
    TypeParent = ResolvedDocumentLocation
  > {
    name?: NameResolver<string, TypeParent, Context>;

    locations?: LocationsResolver<
      ReadonlyArray<Location> | null,
      TypeParent,
      Context
    >;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedDocumentLocation,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LocationsResolver<
    R = ReadonlyArray<Location> | null,
    Parent = ResolvedDocumentLocation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace LocationResolvers {
  export interface Resolvers<Context = {}, TypeParent = Location> {
    start?: StartResolver<number, TypeParent, Context>;

    end?: EndResolver<number, TypeParent, Context>;
  }

  export type StartResolver<
    R = number,
    Parent = Location,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type EndResolver<
    R = number,
    Parent = Location,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace ChangeResolvers {
  export interface Resolvers<Context = {}, TypeParent = Change> {
    message?: MessageResolver<string, TypeParent, Context>;

    path?: PathResolver<string | null, TypeParent, Context>;

    type?: TypeResolver<string, TypeParent, Context>;

    criticality?: CriticalityResolver<Criticality, TypeParent, Context>;
  }

  export type MessageResolver<
    R = string,
    Parent = Change,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = string | null,
    Parent = Change,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = string,
    Parent = Change,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CriticalityResolver<
    R = Criticality,
    Parent = Change,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace CriticalityResolvers {
  export interface Resolvers<Context = {}, TypeParent = Criticality> {
    level?: LevelResolver<CriticalityLevel, TypeParent, Context>;

    reason?: ReasonResolver<string | null, TypeParent, Context>;
  }

  export type LevelResolver<
    R = CriticalityLevel,
    Parent = Criticality,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ReasonResolver<
    R = string | null,
    Parent = Criticality,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace InvalidDocumentResolvers {
  export interface Resolvers<Context = {}, TypeParent = InvalidDocument> {
    source?: SourceResolver<DocumentSource, TypeParent, Context>;

    errors?: ErrorsResolver<
      ReadonlyArray<GraphQlError> | null,
      TypeParent,
      Context
    >;
  }

  export type SourceResolver<
    R = DocumentSource,
    Parent = InvalidDocument,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ErrorsResolver<
    R = ReadonlyArray<GraphQlError> | null,
    Parent = InvalidDocument,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GraphQlErrorResolvers {
  export interface Resolvers<Context = {}, TypeParent = GraphQlError> {
    /** A message describing the Error for debugging purposes. */
    message?: MessageResolver<string, TypeParent, Context>;
    /** An array of { line, column } locations within the source GraphQL documentwhich correspond to this error.Errors during validation often contain multiple locations, for example topoint out two things with the same name. Errors during execution include asingle location, the field which produced the error. */
    locations?: LocationsResolver<
      ReadonlyArray<SourceLocation> | null,
      TypeParent,
      Context
    >;
    /** An array of character offsets within the source GraphQL documentwhich correspond to this error. */
    positions?: PositionsResolver<
      ReadonlyArray<number | null> | null,
      TypeParent,
      Context
    >;
  }

  export type MessageResolver<
    R = string,
    Parent = GraphQlError,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LocationsResolver<
    R = ReadonlyArray<SourceLocation> | null,
    Parent = GraphQlError,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PositionsResolver<
    R = ReadonlyArray<number | null> | null,
    Parent = GraphQlError,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace SourceLocationResolvers {
  export interface Resolvers<Context = {}, TypeParent = SourceLocation> {
    line?: LineResolver<number, TypeParent, Context>;

    column?: ColumnResolver<number, TypeParent, Context>;
  }

  export type LineResolver<
    R = number,
    Parent = SourceLocation,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ColumnResolver<
    R = number,
    Parent = SourceLocation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace SimilarResolvers {
  export interface Resolvers<Context = {}, TypeParent = ResolvedSimilar> {
    name?: NameResolver<string, TypeParent, Context>;

    best?: BestResolver<Match, TypeParent, Context>;

    types?: TypesResolver<ReadonlyArray<Match> | null, TypeParent, Context>;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedSimilar,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type BestResolver<
    R = Match,
    Parent = ResolvedSimilar,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypesResolver<
    R = ReadonlyArray<Match> | null,
    Parent = ResolvedSimilar,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MatchResolvers {
  export interface Resolvers<Context = {}, TypeParent = Match> {
    name?: NameResolver<string, TypeParent, Context>;

    rating?: RatingResolver<number, TypeParent, Context>;
  }

  export type NameResolver<R = string, Parent = Match, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type RatingResolver<
    R = number,
    Parent = Match,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    ping?: PingResolver<string, TypeParent, Context>;
  }

  export type PingResolver<R = string, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string | null;
}
