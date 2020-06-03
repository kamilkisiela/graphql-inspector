import {
  GraphQLDirective,
  DirectiveLocationEnum,
  GraphQLArgument,
} from 'graphql';

import {isNotEqual} from './common/compare';
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
import {diffArrays, unionArrays} from '../utils/arrays';

export function changesInDirective(
  oldDirective: GraphQLDirective,
  newDirective: GraphQLDirective,
): Change[] {
  const changes: Change[] = [];

  if (isNotEqual(oldDirective.description, newDirective.description)) {
    changes.push(directiveDescriptionChanged(oldDirective, newDirective));
  }

  // locations added
  changes.push(
    ...diffArrays(
      newDirective.locations,
      oldDirective.locations,
    ).map((location) =>
      directiveLocationAdded(newDirective, location as DirectiveLocationEnum),
    ),
  );

  // locations removed
  changes.push(
    ...diffArrays(
      oldDirective.locations,
      newDirective.locations,
    ).map((location) =>
      directiveLocationRemoved(oldDirective, location as DirectiveLocationEnum),
    ),
  );

  const oldNames = oldDirective.args.map((a) => a.name);
  const newNames = newDirective.args.map((a) => a.name);

  // arguments added
  changes.push(
    ...diffArrays(newNames, oldNames).map((name) =>
      directiveArgumentAdded(
        newDirective,
        newDirective.args.find((a) => a.name === name) as GraphQLArgument,
      ),
    ),
  );

  // arguments removed
  changes.push(
    ...diffArrays(oldNames, newNames).map((name) =>
      directiveArgumentRemoved(
        oldDirective,
        oldDirective.args.find((a) => a.name === name) as GraphQLArgument,
      ),
    ),
  );

  // common arguments
  unionArrays(oldNames, newNames).forEach((name) => {
    const oldArg = oldDirective.args.find(
      (a) => a.name === name,
    ) as GraphQLArgument;
    const newArg = newDirective.args.find(
      (a) => a.name === name,
    ) as GraphQLArgument;

    changes.push(...changesInDirectiveArgument(oldDirective, oldArg, newArg));
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
