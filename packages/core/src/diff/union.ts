import {GraphQLUnionType, GraphQLObjectType} from 'graphql';
import {Change} from './changes/change';
import {diffArrays} from '../utils/arrays';
import {unionMemberAdded, unionMemberRemoved} from './changes/union';

export function changesInUnion(
  oldUnion: GraphQLUnionType,
  newUnion: GraphQLUnionType,
): Change[] {
  const changes: Change[] = [];
  const oldTypes = oldUnion.getTypes();
  const newTypes = newUnion.getTypes();
  const oldTypenames = oldTypes.map((t) => t.name);
  const newTypenames = newTypes.map((t) => t.name);

  const added = diffArrays(newTypenames, oldTypenames).map(
    (name) => newTypes.find((t) => t.name === name) as GraphQLObjectType,
  );
  const removed = diffArrays(oldTypenames, newTypenames).map(
    (name) => oldTypes.find((t) => t.name === name) as GraphQLObjectType,
  );

  changes.push(...added.map((type) => unionMemberAdded(newUnion, type)));
  changes.push(...removed.map((type) => unionMemberRemoved(oldUnion, type)));

  return changes;
}
