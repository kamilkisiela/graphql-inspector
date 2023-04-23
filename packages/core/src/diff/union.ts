import { GraphQLUnionType } from "graphql";
import { compareLists } from "../utils/compare.js";
import { unionMemberAdded, unionMemberRemoved } from "./changes/union.js";
import { AddChange } from "./schema.js";

export function changesInUnion(
  oldUnion: GraphQLUnionType,
  newUnion: GraphQLUnionType,
  addChange: AddChange
) {
  const oldTypes = oldUnion.getTypes();
  const newTypes = newUnion.getTypes();

  compareLists(oldTypes, newTypes, {
    onAdded(t) {
      addChange(unionMemberAdded(newUnion, t));
    },
    onRemoved(t) {
      addChange(unionMemberRemoved(oldUnion, t));
    },
  });
}
