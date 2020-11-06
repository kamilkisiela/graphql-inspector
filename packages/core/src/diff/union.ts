import {GraphQLUnionType} from 'graphql';
import {Change} from './changes/change';
import {compareLists} from '../utils/compare';
import {unionMemberAdded, unionMemberRemoved} from './changes/union';

export function changesInUnion(
  oldUnion: GraphQLUnionType,
  newUnion: GraphQLUnionType,
): Change[] {
  const changes: Change[] = [];
  const oldTypes = oldUnion.getTypes();
  const newTypes = newUnion.getTypes();

  const {added, removed} = compareLists(oldTypes, newTypes);

  changes.push(...added.map((type) => unionMemberAdded(newUnion, type)));
  changes.push(...removed.map((type) => unionMemberRemoved(oldUnion, type)));

  return changes;
}
