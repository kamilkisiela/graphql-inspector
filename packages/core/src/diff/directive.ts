import { GraphQLDirective, GraphQLArgument } from 'graphql';

import { isNotEqual } from '../utils/compare';
import {
  directiveDescriptionChanged,
  directiveLocationAdded,
  directiveLocationRemoved,
  directiveArgumentAdded,
  directiveArgumentRemoved,
  directiveArgumentDescriptionChanged,
  directiveArgumentDefaultValueChanged,
  directiveArgumentTypeChanged,
} from './changes/directive';
import { diffArrays, compareLists } from '../utils/compare';
import { AddChange } from './schema';

export function changesInDirective(
  oldDirective: GraphQLDirective,
  newDirective: GraphQLDirective,
  addChange: AddChange,
) {
  if (isNotEqual(oldDirective.description, newDirective.description)) {
    addChange(directiveDescriptionChanged(oldDirective, newDirective));
  }

  const locations = {
    added: diffArrays(newDirective.locations, oldDirective.locations),
    removed: diffArrays(oldDirective.locations, newDirective.locations),
  };

  // locations added
  locations.added.forEach((location) =>
    addChange(directiveLocationAdded(newDirective, location as any)),
  );

  // locations removed
  locations.removed.forEach((location) =>
    addChange(directiveLocationRemoved(oldDirective, location as any)),
  );

  compareLists(oldDirective.args, newDirective.args, {
    onAdded(arg) {
      addChange(directiveArgumentAdded(newDirective, arg));
    },
    onRemoved(arg) {
      addChange(directiveArgumentRemoved(oldDirective, arg));
    },
    onMutual(arg) {
      changesInDirectiveArgument(
        oldDirective,
        arg.oldVersion,
        arg.newVersion,
        addChange,
      );
    },
  });
}

function changesInDirectiveArgument(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
  addChange: AddChange,
) {
  if (isNotEqual(oldArg.description, newArg.description)) {
    addChange(directiveArgumentDescriptionChanged(directive, oldArg, newArg));
  }

  if (isNotEqual(oldArg.defaultValue, newArg.defaultValue)) {
    addChange(directiveArgumentDefaultValueChanged(directive, oldArg, newArg));
  }

  if (isNotEqual(oldArg.type.toString(), newArg.type.toString())) {
    addChange(directiveArgumentTypeChanged(directive, oldArg, newArg));
  }
}
