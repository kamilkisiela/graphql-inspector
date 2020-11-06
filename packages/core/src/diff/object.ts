import {GraphQLObjectType} from 'graphql';

import {Change} from './changes/change';
import {
  objectTypeInterfaceAdded,
  objectTypeInterfaceRemoved,
} from './changes/object';
import {fieldRemoved, fieldAdded} from './changes/field';
import {changesInField} from './field';
import {compareLists} from '../utils/compare';

export function changesInObject(
  oldType: GraphQLObjectType,
  newType: GraphQLObjectType,
): Change[] {
  const changes: Change[] = [];

  const oldInterfaces = oldType.getInterfaces();
  const newInterfaces = newType.getInterfaces();

  const oldFields = oldType.getFields();
  const newFields = newType.getFields();

  const interfaces = compareLists(oldInterfaces, newInterfaces);
  const fields = compareLists(
    Object.values(oldFields),
    Object.values(newFields),
  );

  // Interfaces
  changes.push(
    ...interfaces.added.map((i) => objectTypeInterfaceAdded(i, newType)),
    ...interfaces.removed.map((i) => objectTypeInterfaceRemoved(i, oldType)),
  );
  // Fields
  changes.push(
    ...fields.added.map((f) => fieldAdded(newType, f)),
    ...fields.removed.map((f) => fieldRemoved(oldType, f)),
  );
  fields.common.forEach((field) => {
    changes.push(...changesInField(oldType, field.inOld, field.inNew));
  });

  return changes;
}
