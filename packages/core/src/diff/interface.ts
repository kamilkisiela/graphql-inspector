import { GraphQLInterfaceType } from "graphql";
import { compareLists } from "../utils/compare.js";
import { fieldAdded, fieldRemoved } from "./changes/field.js";
import { changesInField } from "./field.js";
import { AddChange } from "./schema.js";

export function changesInInterface(
  oldInterface: GraphQLInterfaceType,
  newInterface: GraphQLInterfaceType,
  addChange: AddChange
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
          addChange
        );
      },
    }
  );
}
