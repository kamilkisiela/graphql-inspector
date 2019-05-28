import * as core from '@graphql-inspector/core';
export type Maybe<T> = T | null;

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

  readonly diff?: Maybe<ReadonlyArray<Change>>;

  readonly validate?: Maybe<ReadonlyArray<InvalidDocument>>;

  readonly similar?: Maybe<ReadonlyArray<Similar>>;

  readonly similarTo: Similar;
}

export interface SchemaCoverage {
  readonly sources?: Maybe<ReadonlyArray<DocumentSource>>;

  readonly types?: Maybe<ReadonlyArray<TypeCoverage>>;
}

export interface DocumentSource {
  readonly body: string;

  readonly name: string;
}

export interface TypeCoverage {
  readonly name: string;

  readonly hits: number;

  readonly children?: Maybe<ReadonlyArray<TypeChildCoverage>>;
}

export interface TypeChildCoverage {
  readonly name: string;

  readonly hits: number;

  readonly locations?: Maybe<ReadonlyArray<DocumentLocation>>;
}

export interface DocumentLocation {
  readonly name: string;

  readonly locations?: Maybe<ReadonlyArray<Location>>;
}

export interface Location {
  readonly start: number;

  readonly end: number;
}

export interface Change {
  readonly message: string;

  readonly path?: Maybe<string>;

  readonly type: string;

  readonly criticality: Criticality;
}

export interface Criticality {
  readonly level: CriticalityLevel;

  readonly reason?: Maybe<string>;
}

export interface InvalidDocument {
  readonly source: DocumentSource;

  readonly errors?: Maybe<ReadonlyArray<GraphQlError>>;
}

export interface GraphQlError {
  /** A message describing the Error for debugging purposes. */
  readonly message: string;
  /** An array of { line, column } locations within the source GraphQL document which correspond to this error. Errors during validation often contain multiple locations, for example to point out two things with the same name. Errors during execution include a single location, the field which produced the error. */
  readonly locations?: Maybe<ReadonlyArray<SourceLocation>>;
  /** An array of character offsets within the source GraphQL document which correspond to this error. */
  readonly positions?: Maybe<ReadonlyArray<Maybe<number>>>;
}

export interface SourceLocation {
  readonly line: number;

  readonly column: number;
}

export interface Similar {
  readonly name: string;

  readonly best: Match;

  readonly types?: Maybe<ReadonlyArray<Match>>;
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

  threshold?: Maybe<number>;
}
export interface SimilarToQueryArgs {
  schema: string;

  name: string;

  threshold?: Maybe<number>;
}

import {GraphQLResolveInfo} from 'graphql';

import {
  ResolvedTypeCoverage,
  ResolvedTypeChildCoverage,
  ResolvedDocumentLocation,
  ResolvedSimilar,
} from '../types';

export type Resolver<Result, Parent = {}, TContext = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, TContext, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo,
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo,
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  TContext = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, TContext, Args>)
  | ISubscriptionResolverObject<Result, Parent, TContext, Args>;

export type TypeResolveFn<Types, Parent = {}, TContext = {}> = (
  parent: Parent,
  context: TContext,
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
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    ping?: PingResolver<string, TypeParent, TContext>;

    coverage?: CoverageResolver<core.SchemaCoverage, TypeParent, TContext>;

    diff?: DiffResolver<Maybe<ReadonlyArray<Change>>, TypeParent, TContext>;

    validate?: ValidateResolver<
      Maybe<ReadonlyArray<InvalidDocument>>,
      TypeParent,
      TContext
    >;

    similar?: SimilarResolver<
      Maybe<ReadonlyArray<ResolvedSimilar>>,
      TypeParent,
      TContext
    >;

    similarTo?: SimilarToResolver<ResolvedSimilar, TypeParent, TContext>;
  }

  export type PingResolver<R = string, Parent = {}, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >;
  export type CoverageResolver<
    R = core.SchemaCoverage,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, CoverageArgs>;
  export interface CoverageArgs {
    schema: string;

    documents: string;
  }

  export type DiffResolver<
    R = Maybe<ReadonlyArray<Change>>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, DiffArgs>;
  export interface DiffArgs {
    oldSchema: string;

    newSchema: string;
  }

  export type ValidateResolver<
    R = Maybe<ReadonlyArray<InvalidDocument>>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, ValidateArgs>;
  export interface ValidateArgs {
    schema: string;

    documents: string;
  }

  export type SimilarResolver<
    R = Maybe<ReadonlyArray<ResolvedSimilar>>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, SimilarArgs>;
  export interface SimilarArgs {
    schema: string;

    threshold?: Maybe<number>;
  }

  export type SimilarToResolver<
    R = ResolvedSimilar,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, SimilarToArgs>;
  export interface SimilarToArgs {
    schema: string;

    name: string;

    threshold?: Maybe<number>;
  }
}

export namespace SchemaCoverageResolvers {
  export interface Resolvers<TContext = {}, TypeParent = core.SchemaCoverage> {
    sources?: SourcesResolver<
      Maybe<ReadonlyArray<DocumentSource>>,
      TypeParent,
      TContext
    >;

    types?: TypesResolver<
      Maybe<ReadonlyArray<ResolvedTypeCoverage>>,
      TypeParent,
      TContext
    >;
  }

  export type SourcesResolver<
    R = Maybe<ReadonlyArray<DocumentSource>>,
    Parent = core.SchemaCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type TypesResolver<
    R = Maybe<ReadonlyArray<ResolvedTypeCoverage>>,
    Parent = core.SchemaCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace DocumentSourceResolvers {
  export interface Resolvers<TContext = {}, TypeParent = DocumentSource> {
    body?: BodyResolver<string, TypeParent, TContext>;

    name?: NameResolver<string, TypeParent, TContext>;
  }

  export type BodyResolver<
    R = string,
    Parent = DocumentSource,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type NameResolver<
    R = string,
    Parent = DocumentSource,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace TypeCoverageResolvers {
  export interface Resolvers<TContext = {}, TypeParent = ResolvedTypeCoverage> {
    name?: NameResolver<string, TypeParent, TContext>;

    hits?: HitsResolver<number, TypeParent, TContext>;

    children?: ChildrenResolver<
      Maybe<ReadonlyArray<ResolvedTypeChildCoverage>>,
      TypeParent,
      TContext
    >;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedTypeCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type HitsResolver<
    R = number,
    Parent = ResolvedTypeCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type ChildrenResolver<
    R = Maybe<ReadonlyArray<ResolvedTypeChildCoverage>>,
    Parent = ResolvedTypeCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace TypeChildCoverageResolvers {
  export interface Resolvers<
    TContext = {},
    TypeParent = ResolvedTypeChildCoverage
  > {
    name?: NameResolver<string, TypeParent, TContext>;

    hits?: HitsResolver<number, TypeParent, TContext>;

    locations?: LocationsResolver<
      Maybe<ReadonlyArray<ResolvedDocumentLocation>>,
      TypeParent,
      TContext
    >;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedTypeChildCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type HitsResolver<
    R = number,
    Parent = ResolvedTypeChildCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type LocationsResolver<
    R = Maybe<ReadonlyArray<ResolvedDocumentLocation>>,
    Parent = ResolvedTypeChildCoverage,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace DocumentLocationResolvers {
  export interface Resolvers<
    TContext = {},
    TypeParent = ResolvedDocumentLocation
  > {
    name?: NameResolver<string, TypeParent, TContext>;

    locations?: LocationsResolver<
      Maybe<ReadonlyArray<Location>>,
      TypeParent,
      TContext
    >;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedDocumentLocation,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type LocationsResolver<
    R = Maybe<ReadonlyArray<Location>>,
    Parent = ResolvedDocumentLocation,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace LocationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Location> {
    start?: StartResolver<number, TypeParent, TContext>;

    end?: EndResolver<number, TypeParent, TContext>;
  }

  export type StartResolver<
    R = number,
    Parent = Location,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type EndResolver<
    R = number,
    Parent = Location,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace ChangeResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Change> {
    message?: MessageResolver<string, TypeParent, TContext>;

    path?: PathResolver<Maybe<string>, TypeParent, TContext>;

    type?: TypeResolver<string, TypeParent, TContext>;

    criticality?: CriticalityResolver<Criticality, TypeParent, TContext>;
  }

  export type MessageResolver<
    R = string,
    Parent = Change,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type PathResolver<
    R = Maybe<string>,
    Parent = Change,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type TypeResolver<
    R = string,
    Parent = Change,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type CriticalityResolver<
    R = Criticality,
    Parent = Change,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace CriticalityResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Criticality> {
    level?: LevelResolver<CriticalityLevel, TypeParent, TContext>;

    reason?: ReasonResolver<Maybe<string>, TypeParent, TContext>;
  }

  export type LevelResolver<
    R = CriticalityLevel,
    Parent = Criticality,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type ReasonResolver<
    R = Maybe<string>,
    Parent = Criticality,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace InvalidDocumentResolvers {
  export interface Resolvers<TContext = {}, TypeParent = InvalidDocument> {
    source?: SourceResolver<DocumentSource, TypeParent, TContext>;

    errors?: ErrorsResolver<
      Maybe<ReadonlyArray<GraphQlError>>,
      TypeParent,
      TContext
    >;
  }

  export type SourceResolver<
    R = DocumentSource,
    Parent = InvalidDocument,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type ErrorsResolver<
    R = Maybe<ReadonlyArray<GraphQlError>>,
    Parent = InvalidDocument,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace GraphQlErrorResolvers {
  export interface Resolvers<TContext = {}, TypeParent = GraphQlError> {
    /** A message describing the Error for debugging purposes. */
    message?: MessageResolver<string, TypeParent, TContext>;
    /** An array of { line, column } locations within the source GraphQL document which correspond to this error. Errors during validation often contain multiple locations, for example to point out two things with the same name. Errors during execution include a single location, the field which produced the error. */
    locations?: LocationsResolver<
      Maybe<ReadonlyArray<SourceLocation>>,
      TypeParent,
      TContext
    >;
    /** An array of character offsets within the source GraphQL document which correspond to this error. */
    positions?: PositionsResolver<
      Maybe<ReadonlyArray<Maybe<number>>>,
      TypeParent,
      TContext
    >;
  }

  export type MessageResolver<
    R = string,
    Parent = GraphQlError,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type LocationsResolver<
    R = Maybe<ReadonlyArray<SourceLocation>>,
    Parent = GraphQlError,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type PositionsResolver<
    R = Maybe<ReadonlyArray<Maybe<number>>>,
    Parent = GraphQlError,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace SourceLocationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = SourceLocation> {
    line?: LineResolver<number, TypeParent, TContext>;

    column?: ColumnResolver<number, TypeParent, TContext>;
  }

  export type LineResolver<
    R = number,
    Parent = SourceLocation,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type ColumnResolver<
    R = number,
    Parent = SourceLocation,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace SimilarResolvers {
  export interface Resolvers<TContext = {}, TypeParent = ResolvedSimilar> {
    name?: NameResolver<string, TypeParent, TContext>;

    best?: BestResolver<Match, TypeParent, TContext>;

    types?: TypesResolver<Maybe<ReadonlyArray<Match>>, TypeParent, TContext>;
  }

  export type NameResolver<
    R = string,
    Parent = ResolvedSimilar,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type BestResolver<
    R = Match,
    Parent = ResolvedSimilar,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type TypesResolver<
    R = Maybe<ReadonlyArray<Match>>,
    Parent = ResolvedSimilar,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace MatchResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Match> {
    name?: NameResolver<string, TypeParent, TContext>;

    rating?: RatingResolver<number, TypeParent, TContext>;
  }

  export type NameResolver<
    R = string,
    Parent = Match,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
  export type RatingResolver<
    R = number,
    Parent = Match,
    TContext = {}
  > = Resolver<R, Parent, TContext>;
}

export namespace MutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    ping?: PingResolver<string, TypeParent, TContext>;
  }

  export type PingResolver<R = string, Parent = {}, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
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
  reason?: string;
}

export type IResolvers<TContext = {}> = {
  Query?: QueryResolvers.Resolvers<TContext>;
  SchemaCoverage?: SchemaCoverageResolvers.Resolvers<TContext>;
  DocumentSource?: DocumentSourceResolvers.Resolvers<TContext>;
  TypeCoverage?: TypeCoverageResolvers.Resolvers<TContext>;
  TypeChildCoverage?: TypeChildCoverageResolvers.Resolvers<TContext>;
  DocumentLocation?: DocumentLocationResolvers.Resolvers<TContext>;
  Location?: LocationResolvers.Resolvers<TContext>;
  Change?: ChangeResolvers.Resolvers<TContext>;
  Criticality?: CriticalityResolvers.Resolvers<TContext>;
  InvalidDocument?: InvalidDocumentResolvers.Resolvers<TContext>;
  GraphQlError?: GraphQlErrorResolvers.Resolvers<TContext>;
  SourceLocation?: SourceLocationResolvers.Resolvers<TContext>;
  Similar?: SimilarResolvers.Resolvers<TContext>;
  Match?: MatchResolvers.Resolvers<TContext>;
  Mutation?: MutationResolvers.Resolvers<TContext>;
} & {[typeName: string]: never};

export type IDirectiveResolvers<Result> = {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
} & {[directiveName: string]: never};
