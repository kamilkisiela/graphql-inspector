import * as core from '@graphql-inspector/core';
import { GraphQLResolveInfo } from 'graphql';
import { ResolvedTypeCoverage, ResolvedTypeChildCoverage, ResolvedDocumentLocation, ResolvedSimilar } from '../types';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  readonly __typename?: 'Query';
  readonly ping: Scalars['String'];
  readonly coverage: SchemaCoverage;
  readonly diff?: Maybe<ReadonlyArray<Change>>;
  readonly validate?: Maybe<ReadonlyArray<InvalidDocument>>;
  readonly similar?: Maybe<ReadonlyArray<Similar>>;
  readonly similarTo: Similar;
};


export type QueryCoverageArgs = {
  schema: Scalars['String'];
  documents: Scalars['String'];
};


export type QueryDiffArgs = {
  oldSchema: Scalars['String'];
  newSchema: Scalars['String'];
};


export type QueryValidateArgs = {
  schema: Scalars['String'];
  documents: Scalars['String'];
};


export type QuerySimilarArgs = {
  schema: Scalars['String'];
  threshold?: Maybe<Scalars['Float']>;
};


export type QuerySimilarToArgs = {
  schema: Scalars['String'];
  name: Scalars['String'];
  threshold?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly ping: Scalars['String'];
};

export type DocumentSource = {
  readonly __typename?: 'DocumentSource';
  readonly body: Scalars['String'];
  readonly name: Scalars['String'];
};

export type SourceLocation = {
  readonly __typename?: 'SourceLocation';
  readonly line: Scalars['Int'];
  readonly column: Scalars['Int'];
};

export type GraphQlError = {
  readonly __typename?: 'GraphQLError';
  /** A message describing the Error for debugging purposes. */
  readonly message: Scalars['String'];
  /**
   * An array of { line, column } locations within the source GraphQL document
   * which correspond to this error.
   * 
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   */
  readonly locations?: Maybe<ReadonlyArray<SourceLocation>>;
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  readonly positions?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
};

export type Location = {
  readonly __typename?: 'Location';
  readonly start: Scalars['Int'];
  readonly end: Scalars['Int'];
};

export type DocumentLocation = {
  readonly __typename?: 'DocumentLocation';
  readonly name: Scalars['String'];
  readonly locations?: Maybe<ReadonlyArray<Location>>;
};

export type TypeChildCoverage = {
  readonly __typename?: 'TypeChildCoverage';
  readonly name: Scalars['String'];
  readonly hits: Scalars['Int'];
  readonly locations?: Maybe<ReadonlyArray<DocumentLocation>>;
};

export type TypeCoverage = {
  readonly __typename?: 'TypeCoverage';
  readonly name: Scalars['String'];
  readonly hits: Scalars['Int'];
  readonly children?: Maybe<ReadonlyArray<TypeChildCoverage>>;
};

export type SchemaCoverage = {
  readonly __typename?: 'SchemaCoverage';
  readonly sources?: Maybe<ReadonlyArray<DocumentSource>>;
  readonly types?: Maybe<ReadonlyArray<TypeCoverage>>;
};

export enum CriticalityLevel {
  Breaking = 'BREAKING',
  NonBreaking = 'NON_BREAKING',
  Dangerous = 'DANGEROUS'
}

export type Criticality = {
  readonly __typename?: 'Criticality';
  readonly level: CriticalityLevel;
  readonly reason?: Maybe<Scalars['String']>;
};

export type Change = {
  readonly __typename?: 'Change';
  readonly message: Scalars['String'];
  readonly path?: Maybe<Scalars['String']>;
  readonly type: Scalars['String'];
  readonly criticality: Criticality;
};

export type InvalidDocument = {
  readonly __typename?: 'InvalidDocument';
  readonly source: DocumentSource;
  readonly errors?: Maybe<ReadonlyArray<GraphQlError>>;
};

export type Match = {
  readonly __typename?: 'Match';
  readonly name: Scalars['String'];
  readonly rating: Scalars['Float'];
};

export type Similar = {
  readonly __typename?: 'Similar';
  readonly name: Scalars['String'];
  readonly best: Match;
  readonly types?: Maybe<ReadonlyArray<Match>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Query: ResolverTypeWrapper<{}>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Mutation: ResolverTypeWrapper<{}>,
  DocumentSource: ResolverTypeWrapper<DocumentSource>,
  SourceLocation: ResolverTypeWrapper<SourceLocation>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  GraphQLError: ResolverTypeWrapper<GraphQlError>,
  Location: ResolverTypeWrapper<Location>,
  DocumentLocation: ResolverTypeWrapper<ResolvedDocumentLocation>,
  TypeChildCoverage: ResolverTypeWrapper<ResolvedTypeChildCoverage>,
  TypeCoverage: ResolverTypeWrapper<ResolvedTypeCoverage>,
  SchemaCoverage: ResolverTypeWrapper<core.SchemaCoverage>,
  CriticalityLevel: CriticalityLevel,
  Criticality: ResolverTypeWrapper<Criticality>,
  Change: ResolverTypeWrapper<Change>,
  InvalidDocument: ResolverTypeWrapper<InvalidDocument>,
  Match: ResolverTypeWrapper<Match>,
  Similar: ResolverTypeWrapper<ResolvedSimilar>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  Query: {},
  Float: Scalars['Float'],
  Mutation: {},
  DocumentSource: DocumentSource,
  SourceLocation: SourceLocation,
  Int: Scalars['Int'],
  GraphQLError: GraphQlError,
  Location: Location,
  DocumentLocation: ResolvedDocumentLocation,
  TypeChildCoverage: ResolvedTypeChildCoverage,
  TypeCoverage: ResolvedTypeCoverage,
  SchemaCoverage: core.SchemaCoverage,
  CriticalityLevel: CriticalityLevel,
  Criticality: Criticality,
  Change: Change,
  InvalidDocument: InvalidDocument,
  Match: Match,
  Similar: ResolvedSimilar,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  coverage?: Resolver<ResolversTypes['SchemaCoverage'], ParentType, ContextType, RequireFields<QueryCoverageArgs, 'schema' | 'documents'>>,
  diff?: Resolver<Maybe<ReadonlyArray<ResolversTypes['Change']>>, ParentType, ContextType, RequireFields<QueryDiffArgs, 'oldSchema' | 'newSchema'>>,
  validate?: Resolver<Maybe<ReadonlyArray<ResolversTypes['InvalidDocument']>>, ParentType, ContextType, RequireFields<QueryValidateArgs, 'schema' | 'documents'>>,
  similar?: Resolver<Maybe<ReadonlyArray<ResolversTypes['Similar']>>, ParentType, ContextType, RequireFields<QuerySimilarArgs, 'schema'>>,
  similarTo?: Resolver<ResolversTypes['Similar'], ParentType, ContextType, RequireFields<QuerySimilarToArgs, 'schema' | 'name'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type DocumentSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentSource'] = ResolversParentTypes['DocumentSource']> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type SourceLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceLocation'] = ResolversParentTypes['SourceLocation']> = {
  line?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  column?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type GraphQlErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['GraphQLError'] = ResolversParentTypes['GraphQLError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  locations?: Resolver<Maybe<ReadonlyArray<ResolversTypes['SourceLocation']>>, ParentType, ContextType>,
  positions?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  start?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DocumentLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentLocation'] = ResolversParentTypes['DocumentLocation']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  locations?: Resolver<Maybe<ReadonlyArray<ResolversTypes['Location']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TypeChildCoverageResolvers<ContextType = any, ParentType extends ResolversParentTypes['TypeChildCoverage'] = ResolversParentTypes['TypeChildCoverage']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  hits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  locations?: Resolver<Maybe<ReadonlyArray<ResolversTypes['DocumentLocation']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TypeCoverageResolvers<ContextType = any, ParentType extends ResolversParentTypes['TypeCoverage'] = ResolversParentTypes['TypeCoverage']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  hits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  children?: Resolver<Maybe<ReadonlyArray<ResolversTypes['TypeChildCoverage']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type SchemaCoverageResolvers<ContextType = any, ParentType extends ResolversParentTypes['SchemaCoverage'] = ResolversParentTypes['SchemaCoverage']> = {
  sources?: Resolver<Maybe<ReadonlyArray<ResolversTypes['DocumentSource']>>, ParentType, ContextType>,
  types?: Resolver<Maybe<ReadonlyArray<ResolversTypes['TypeCoverage']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CriticalityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Criticality'] = ResolversParentTypes['Criticality']> = {
  level?: Resolver<ResolversTypes['CriticalityLevel'], ParentType, ContextType>,
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Change'] = ResolversParentTypes['Change']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  criticality?: Resolver<ResolversTypes['Criticality'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type InvalidDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidDocument'] = ResolversParentTypes['InvalidDocument']> = {
  source?: Resolver<ResolversTypes['DocumentSource'], ParentType, ContextType>,
  errors?: Resolver<Maybe<ReadonlyArray<ResolversTypes['GraphQLError']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Match'] = ResolversParentTypes['Match']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type SimilarResolvers<ContextType = any, ParentType extends ResolversParentTypes['Similar'] = ResolversParentTypes['Similar']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  best?: Resolver<ResolversTypes['Match'], ParentType, ContextType>,
  types?: Resolver<Maybe<ReadonlyArray<ResolversTypes['Match']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  DocumentSource?: DocumentSourceResolvers<ContextType>,
  SourceLocation?: SourceLocationResolvers<ContextType>,
  GraphQLError?: GraphQlErrorResolvers<ContextType>,
  Location?: LocationResolvers<ContextType>,
  DocumentLocation?: DocumentLocationResolvers<ContextType>,
  TypeChildCoverage?: TypeChildCoverageResolvers<ContextType>,
  TypeCoverage?: TypeCoverageResolvers<ContextType>,
  SchemaCoverage?: SchemaCoverageResolvers<ContextType>,
  Criticality?: CriticalityResolvers<ContextType>,
  Change?: ChangeResolvers<ContextType>,
  InvalidDocument?: InvalidDocumentResolvers<ContextType>,
  Match?: MatchResolvers<ContextType>,
  Similar?: SimilarResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
