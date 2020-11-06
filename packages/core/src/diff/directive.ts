import {
  GraphQLDirective,
  DirectiveLocationEnum,
  GraphQLArgument,
} from 'graphql';

import {isNotEqual} from '../utils/compare';
import {Change} from './changes/change';
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
import {diffArrays, compareLists} from '../utils/compare';

export function changesInDirective(
  oldDirective: GraphQLDirective,
  newDirective: GraphQLDirective,
): Change[] {
  const changes: Change[] = [];

  if (isNotEqual(oldDirective.description, newDirective.description)) {
    changes.push(directiveDescriptionChanged(oldDirective, newDirective));
  }

  const locations = {
    added: diffArrays(newDirective.locations, oldDirective.locations),
    removed: diffArrays(oldDirective.locations, newDirective.locations),
  };

  // locations added
  changes.push(
    ...locations.added.map((location) =>
      directiveLocationAdded(newDirective, location as DirectiveLocationEnum),
    ),
  );

  // locations removed
  changes.push(
    ...locations.removed.map((location) =>
      directiveLocationRemoved(oldDirective, location as DirectiveLocationEnum),
    ),
  );

  const args = compareLists(oldDirective.args, newDirective.args);

  // arguments added
  changes.push(
    ...args.added.map((arg) => directiveArgumentAdded(newDirective, arg)),
  );
  // arguments removed
  changes.push(
    ...args.removed.map((arg) => directiveArgumentRemoved(oldDirective, arg)),
  );

  // common arguments
  args.common.forEach((arg) => {
    changes.push(
      ...changesInDirectiveArgument(oldDirective, arg.inOld, arg.inNew),
    );
  });

  return changes;
}

function changesInDirectiveArgument(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change[] {
  const changes: Change[] = [];

  if (isNotEqual(oldArg.description, newArg.description)) {
    changes.push(
      directiveArgumentDescriptionChanged(directive, oldArg, newArg),
    );
  }

  if (isNotEqual(oldArg.defaultValue, newArg.defaultValue)) {
    changes.push(
      directiveArgumentDefaultValueChanged(directive, oldArg, newArg),
    );
  }

  if (isNotEqual(oldArg.type.toString(), newArg.type.toString())) {
    changes.push(directiveArgumentTypeChanged(directive, oldArg, newArg));
  }

  return changes;
}
