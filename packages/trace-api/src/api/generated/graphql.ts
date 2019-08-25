import * as models from '../../db/models';
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import {InspectorApiContext} from '../context';
export type Maybe<T> = T | undefined;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  {[P in K]-?: NonNullable<T[P]>};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
};

export type Field = {
  __typename?: 'Field';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly type: Scalars['String'];
  readonly traces?: Maybe<ReadonlyArray<FieldTrace>>;
};

export type FieldTrace = {
  __typename?: 'FieldTrace';
  readonly id: Scalars['ID'];
  readonly path: Scalars['String'];
  readonly field: Field;
  readonly startTime: Scalars['Long'];
  readonly endTime: Scalars['Long'];
  readonly duration: Scalars['Long'];
  readonly errors?: Maybe<ReadonlyArray<TraceError>>;
};

export type HasField = {
  readonly name?: Maybe<Scalars['String']>;
  readonly type?: Maybe<Scalars['String']>;
};

export type Operation = {
  __typename?: 'Operation';
  readonly fields?: Maybe<ReadonlyArray<Field>>;
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly signature: Scalars['String'];
  readonly operation: Scalars['String'];
  readonly traces?: Maybe<ReadonlyArray<OperationTrace>>;
};

export type OperationFilter = {
  readonly limit?: Maybe<Scalars['Int']>;
  readonly period?: Maybe<Scalars['String']>;
  readonly where?: Maybe<OperationFilterWhere>;
};

export type OperationFilterWhere = {
  readonly operationName?: Maybe<Scalars['String']>;
  readonly hasField?: Maybe<HasField>;
};

export type OperationTrace = {
  __typename?: 'OperationTrace';
  readonly id: Scalars['ID'];
  readonly operation: Operation;
  readonly startTime: Scalars['Long'];
  readonly duration: Scalars['Long'];
  readonly parsing?: Maybe<Scalars['Long']>;
  readonly validation?: Maybe<Scalars['Long']>;
  readonly execution?: Maybe<Scalars['Long']>;
  readonly fieldTraces?: Maybe<ReadonlyArray<FieldTrace>>;
  readonly errors?: Maybe<ReadonlyArray<TraceError>>;
};

export type Query = {
  __typename?: 'Query';
  readonly _?: Maybe<Scalars['String']>;
  readonly fields?: Maybe<ReadonlyArray<Field>>;
  readonly operations?: Maybe<ReadonlyArray<Operation>>;
  readonly operationTraces?: Maybe<ReadonlyArray<OperationTrace>>;
  readonly usage: UsageResult;
};

export type QueryOperationsArgs = {
  filter?: Maybe<OperationFilter>;
};

export type QueryUsageArgs = {
  input: UsageInput;
};

export type TraceError = {
  __typename?: 'TraceError';
  readonly message: Scalars['String'];
  readonly locations?: Maybe<ReadonlyArray<TraceErrorLocation>>;
  readonly json?: Maybe<Scalars['String']>;
};

export type TraceErrorLocation = {
  __typename?: 'TraceErrorLocation';
  readonly line: Scalars['Int'];
  readonly column: Scalars['Int'];
};

export type UsageCountSummary = {
  __typename?: 'UsageCountSummary';
  readonly min: Scalars['Long'];
  readonly max: Scalars['Long'];
  readonly average: Scalars['Long'];
  readonly total: Scalars['Long'];
};

export type UsageInput = {
  readonly field: Scalars['String'];
  readonly type: Scalars['String'];
  readonly period?: Maybe<Scalars['String']>;
};

export type UsageNode = {
  __typename?: 'UsageNode';
  readonly id: Scalars['ID'];
  readonly operation: Scalars['String'];
  readonly count: Scalars['Long'];
  readonly percentage: Scalars['Float'];
};

export type UsagePercentageSummary = {
  __typename?: 'UsagePercentageSummary';
  readonly min: Scalars['Float'];
  readonly max: Scalars['Float'];
};

export type UsageResult = {
  __typename?: 'UsageResult';
  readonly count: UsageCountSummary;
  readonly percentage?: Maybe<UsagePercentageSummary>;
  readonly nodes?: Maybe<ReadonlyArray<UsageNode>>;
};
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    {[key in TKey]: TResult},
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    {[key in TKey]: TResult},
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Field: ResolverTypeWrapper<models.FieldModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  FieldTrace: ResolverTypeWrapper<models.FieldTraceModel>;
  Long: ResolverTypeWrapper<Scalars['Long']>;
  TraceError: ResolverTypeWrapper<TraceError>;
  TraceErrorLocation: ResolverTypeWrapper<TraceErrorLocation>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OperationFilter: OperationFilter;
  OperationFilterWhere: OperationFilterWhere;
  HasField: HasField;
  Operation: ResolverTypeWrapper<models.OperationModel>;
  OperationTrace: ResolverTypeWrapper<models.OperationTraceModel>;
  UsageInput: UsageInput;
  UsageResult: ResolverTypeWrapper<UsageResult>;
  UsageCountSummary: ResolverTypeWrapper<UsageCountSummary>;
  UsagePercentageSummary: ResolverTypeWrapper<UsagePercentageSummary>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  UsageNode: ResolverTypeWrapper<UsageNode>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Scalars['String'];
  Field: models.FieldModel;
  ID: Scalars['ID'];
  FieldTrace: models.FieldTraceModel;
  Long: Scalars['Long'];
  TraceError: TraceError;
  TraceErrorLocation: TraceErrorLocation;
  Int: Scalars['Int'];
  OperationFilter: OperationFilter;
  OperationFilterWhere: OperationFilterWhere;
  HasField: HasField;
  Operation: models.OperationModel;
  OperationTrace: models.OperationTraceModel;
  UsageInput: UsageInput;
  UsageResult: UsageResult;
  UsageCountSummary: UsageCountSummary;
  UsagePercentageSummary: UsagePercentageSummary;
  Float: Scalars['Float'];
  UsageNode: UsageNode;
  Boolean: Scalars['Boolean'];
}>;

export type FieldResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traces?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['FieldTrace']>>,
    ParentType,
    ContextType
  >;
}>;

export type FieldTraceResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['FieldTrace'] = ResolversParentTypes['FieldTrace']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  errors?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['TraceError']>>,
    ParentType,
    ContextType
  >;
}>;

export interface LongScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export type OperationResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['Operation'] = ResolversParentTypes['Operation']
> = ResolversObject<{
  fields?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['Field']>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traces?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['OperationTrace']>>,
    ParentType,
    ContextType
  >;
}>;

export type OperationTraceResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['OperationTrace'] = ResolversParentTypes['OperationTrace']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['Operation'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  parsing?: Resolver<Maybe<ResolversTypes['Long']>, ParentType, ContextType>;
  validation?: Resolver<Maybe<ResolversTypes['Long']>, ParentType, ContextType>;
  execution?: Resolver<Maybe<ResolversTypes['Long']>, ParentType, ContextType>;
  fieldTraces?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['FieldTrace']>>,
    ParentType,
    ContextType
  >;
  errors?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['TraceError']>>,
    ParentType,
    ContextType
  >;
}>;

export type QueryResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fields?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['Field']>>,
    ParentType,
    ContextType
  >;
  operations?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['Operation']>>,
    ParentType,
    ContextType,
    QueryOperationsArgs
  >;
  operationTraces?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['OperationTrace']>>,
    ParentType,
    ContextType
  >;
  usage?: Resolver<
    ResolversTypes['UsageResult'],
    ParentType,
    ContextType,
    RequireFields<QueryUsageArgs, 'input'>
  >;
}>;

export type TraceErrorResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['TraceError'] = ResolversParentTypes['TraceError']
> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locations?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['TraceErrorLocation']>>,
    ParentType,
    ContextType
  >;
  json?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type TraceErrorLocationResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['TraceErrorLocation'] = ResolversParentTypes['TraceErrorLocation']
> = ResolversObject<{
  line?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  column?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type UsageCountSummaryResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['UsageCountSummary'] = ResolversParentTypes['UsageCountSummary']
> = ResolversObject<{
  min?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  max?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  average?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
}>;

export type UsageNodeResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['UsageNode'] = ResolversParentTypes['UsageNode']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type UsagePercentageSummaryResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['UsagePercentageSummary'] = ResolversParentTypes['UsagePercentageSummary']
> = ResolversObject<{
  min?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  max?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type UsageResultResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['UsageResult'] = ResolversParentTypes['UsageResult']
> = ResolversObject<{
  count?: Resolver<
    ResolversTypes['UsageCountSummary'],
    ParentType,
    ContextType
  >;
  percentage?: Resolver<
    Maybe<ResolversTypes['UsagePercentageSummary']>,
    ParentType,
    ContextType
  >;
  nodes?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['UsageNode']>>,
    ParentType,
    ContextType
  >;
}>;

export type Resolvers<ContextType = InspectorApiContext> = ResolversObject<{
  Field?: FieldResolvers<ContextType>;
  FieldTrace?: FieldTraceResolvers<ContextType>;
  Long?: GraphQLScalarType;
  Operation?: OperationResolvers<ContextType>;
  OperationTrace?: OperationTraceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TraceError?: TraceErrorResolvers<ContextType>;
  TraceErrorLocation?: TraceErrorLocationResolvers<ContextType>;
  UsageCountSummary?: UsageCountSummaryResolvers<ContextType>;
  UsageNode?: UsageNodeResolvers<ContextType>;
  UsagePercentageSummary?: UsagePercentageSummaryResolvers<ContextType>;
  UsageResult?: UsageResultResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = InspectorApiContext> = Resolvers<
  ContextType
>;
