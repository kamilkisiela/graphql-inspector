import {GraphQLInterfaceType} from 'graphql';

import {Change} from './changes/change';
import {fieldRemoved, fieldAdded} from './changes/field';
import {changesInField} from './field';
import {compareLists} from '../utils/compare';

export function changesInInterface(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
): Change[] {
  const changes: Change[] = [];

  const fields = compareLists(
    Object.values(oldInterface.getFields()),
    Object.values(newInterface.getFields()),
  );

  changes.push(...fields.added.map((f) => fieldAdded(newInterface, f)));
  changes.push(...fields.removed.map((f) => fieldRemoved(oldInterface, f)));

  fields.common.forEach(({inOld, inNew}) => {
    changes.push(...changesInField(oldInterface, inOld, inNew));
  });

  return changes;
}
