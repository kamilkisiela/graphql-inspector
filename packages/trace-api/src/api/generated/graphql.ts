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
};

export type FieldTrace = {
  __typename?: 'FieldTrace';
  readonly id: Scalars['ID'];
  readonly path: Scalars['String'];
  readonly field: Field;
  readonly startTime: Scalars['Long'];
  readonly endTime: Scalars['Long'];
  readonly duration: Scalars['Long'];
};

export type Operation = {
  __typename?: 'Operation';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly signature: Scalars['String'];
  readonly operation: Scalars['String'];
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
  readonly fieldTraces?: Maybe<ReadonlyArray<Maybe<FieldTrace>>>;
};

export type Query = {
  __typename?: 'Query';
  readonly _?: Maybe<Scalars['String']>;
  readonly fields?: Maybe<ReadonlyArray<Field>>;
  readonly operations?: Maybe<ReadonlyArray<Operation>>;
  readonly operationTraces?: Maybe<ReadonlyArray<Maybe<OperationTrace>>>;
  readonly usage?: Maybe<ReadonlyArray<UsageResult>>;
};

export type QueryUsageArgs = {
  input: UsageInput;
};

export type UsageInput = {
  readonly field: Scalars['String'];
  readonly type: Scalars['String'];
  readonly period?: Maybe<Scalars['String']>;
};

export type UsageResult = {
  __typename?: 'UsageResult';
  readonly id: Scalars['ID'];
  readonly operation: Scalars['String'];
  readonly count: Scalars['Long'];
  readonly percentage: Scalars['Float'];
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
  Operation: ResolverTypeWrapper<models.OperationModel>;
  OperationTrace: ResolverTypeWrapper<models.OperationTraceModel>;
  Long: ResolverTypeWrapper<Scalars['Long']>;
  FieldTrace: ResolverTypeWrapper<models.FieldTraceModel>;
  UsageInput: UsageInput;
  UsageResult: ResolverTypeWrapper<UsageResult>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Scalars['String'];
  Field: models.FieldModel;
  ID: Scalars['ID'];
  Operation: models.OperationModel;
  OperationTrace: models.OperationTraceModel;
  Long: Scalars['Long'];
  FieldTrace: models.FieldTraceModel;
  UsageInput: UsageInput;
  UsageResult: UsageResult;
  Float: Scalars['Float'];
  Boolean: Scalars['Boolean'];
}>;

export type FieldResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
}>;

export interface LongScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export type OperationResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['Operation'] = ResolversParentTypes['Operation']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
    Maybe<ReadonlyArray<Maybe<ResolversTypes['FieldTrace']>>>,
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
    ContextType
  >;
  operationTraces?: Resolver<
    Maybe<ReadonlyArray<Maybe<ResolversTypes['OperationTrace']>>>,
    ParentType,
    ContextType
  >;
  usage?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes['UsageResult']>>,
    ParentType,
    ContextType,
    RequireFields<QueryUsageArgs, 'input'>
  >;
}>;

export type UsageResultResolvers<
  ContextType = InspectorApiContext,
  ParentType extends ResolversParentTypes['UsageResult'] = ResolversParentTypes['UsageResult']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Long'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = InspectorApiContext> = ResolversObject<{
  Field?: FieldResolvers<ContextType>;
  FieldTrace?: FieldTraceResolvers<ContextType>;
  Long?: GraphQLScalarType;
  Operation?: OperationResolvers<ContextType>;
  OperationTrace?: OperationTraceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UsageResult?: UsageResultResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = InspectorApiContext> = Resolvers<
  ContextType
>;
