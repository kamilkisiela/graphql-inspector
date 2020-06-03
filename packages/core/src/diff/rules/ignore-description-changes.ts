import {ChangeType} from '../changes/change';
import {Rule} from './types';

const descriptionChangeTypes: ChangeType[] = [
  ChangeType.FieldArgumentDescriptionChanged,
  ChangeType.DirectiveDescriptionChanged,
  ChangeType.DirectiveArgumentDescriptionChanged,
  ChangeType.EnumValueDescriptionChanged,
  ChangeType.FieldDescriptionChanged,
  ChangeType.FieldDescriptionAdded,
  ChangeType.FieldDescriptionRemoved,
  ChangeType.InputFieldDescriptionAdded,
  ChangeType.InputFieldDescriptionRemoved,
  ChangeType.InputFieldDescriptionChanged,
  ChangeType.TypeDescriptionChanged,
];

export const ignoreDescriptionChanges: Rule = ({changes}) => {
  return changes.filter(
    (change) => descriptionChangeTypes.indexOf(change.type) === -1,
  );
};
