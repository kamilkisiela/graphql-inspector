import * as core from '@graphql-inspector/core';

// ====================================================
// Types
// ====================================================

export interface Query {
  ping: string;

  coverage: SchemaCoverage;
}

export interface SchemaCoverage {
  sources?: DocumentSource[] | null;

  types?: TypeCoverage[] | null;
}

export interface DocumentSource {
  body: string;

  name: string;
}

export interface TypeCoverage {
  name: string;

  hits: number;

  children?: TypeChildCoverage[] | null;
}

export interface TypeChildCoverage {
  name: string;

  hits: number;

  locations?: Location[] | null;
}

export interface Location {
  name: string;

  start: number;

  end: number;
}

export interface Mutation {
  ping: string;
}

// ====================================================
// Arguments
// ====================================================

export interface CoverageQueryArgs {
  schema: string;

  documents: string;
}

import {GraphQLResolveInfo, GraphQLScalarTypeConfig} from 'graphql';

import {ResolvedTypeCoverage, ResolvedTypeChildCoverage} from '../types';

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
}

export namespace SchemaCoverageResolvers {
  export interface Resolvers<Context = {}, TypeParent = core.SchemaCoverage> {
    sources?: SourcesResolver<DocumentSource[] | null, TypeParent, Context>;

    types?: TypesResolver<ResolvedTypeCoverage[] | null, TypeParent, Context>;
  }

  export type SourcesResolver<
    R = DocumentSource[] | null,
    Parent = core.SchemaCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TypesResolver<
    R = ResolvedTypeCoverage[] | null,
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
      ResolvedTypeChildCoverage[] | null,
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
    R = ResolvedTypeChildCoverage[] | null,
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

    locations?: LocationsResolver<Location[] | null, TypeParent, Context>;
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
    R = Location[] | null,
    Parent = ResolvedTypeChildCoverage,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace LocationResolvers {
  export interface Resolvers<Context = {}, TypeParent = Location> {
    name?: NameResolver<string, TypeParent, Context>;

    start?: StartResolver<number, TypeParent, Context>;

    end?: EndResolver<number, TypeParent, Context>;
  }

  export type NameResolver<
    R = string,
    Parent = Location,
    Context = {}
  > = Resolver<R, Parent, Context>;
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
