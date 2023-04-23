import { ChangeType } from "../changes/change.js";
import { Rule } from "./types.js";

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

export const ignoreDescriptionChanges: Rule = ({ changes }) => {
  return changes.filter(
    (change) => !descriptionChangeTypes.includes(change.type)
  );
};
