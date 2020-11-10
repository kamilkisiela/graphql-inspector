import {GraphQLInterfaceType} from 'graphql';

import {fieldRemoved, fieldAdded} from './changes/field';
import {changesInField, addedInField} from './field';
import {compareLists} from '../utils/compare';
import {AddChange} from './schema';

export function changesInInterface(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
  addChange: AddChange,
) {
  compareLists(
    Object.values(oldInterface.getFields()),
    Object.values(newInterface.getFields()),
    {
      onAdded(field) {
        addChange(fieldAdded(newInterface, field));
      },
      onRemoved(field) {
        addChange(fieldRemoved(oldInterface, field));
      },
      onMutual(field) {
        changesInField(
          oldInterface,
          field.oldVersion,
          field.newVersion,
          addChange,
        );
      },
    },
  );
}

export function addedInInterface(
  interfaceType: GraphQLInterfaceType,
  addChange: AddChange,
) {
  const fields = Object.values(interfaceType.getFields());

  fields.forEach((field) => addedInField(interfaceType, field, addChange));
}
