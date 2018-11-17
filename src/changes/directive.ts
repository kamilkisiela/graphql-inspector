import {
  GraphQLDirective,
  DirectiveLocationEnum,
  GraphQLArgument,
  isNonNullType,
} from 'graphql';

import {Change, CriticalityLevel} from './change';
import {safeChangeForInputValue} from '../utils/graphql';

export function directiveRemoved(directive: GraphQLDirective): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: `Directive '${directive.name}' was removed`,
    path: `@${directive.name}`,
  };
}
export function directiveAdded(directive: GraphQLDirective): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Directive '${directive.name}' was added`,
    path: `@${directive.name}`,
  };
}

export function directiveDescriptionChanged(
  oldDirective: GraphQLDirective,
  newDirective: GraphQLDirective,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Directive '${oldDirective.name}' description changed from '${
      oldDirective.description
    }' to '${newDirective.description}'`,
    path: `@${oldDirective.name}`,
  };
}

export function directiveLocationAdded(
  directive: GraphQLDirective,
  location: DirectiveLocationEnum,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Location '${location}' was added to directive '${
      directive.name
    }'`,
    path: `@${directive.name}`,
  };
}

export function directiveLocationRemoved(
  directive: GraphQLDirective,
  location: DirectiveLocationEnum,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: `Location '${location}' was removed from directive '${
      directive.name
    }'`,
    path: `@${directive.name}`,
  };
}

export function directiveArgumentAdded(
  directive: GraphQLDirective,
  arg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: isNonNullType(arg.type)
        ? CriticalityLevel.Breaking
        : CriticalityLevel.NonBreaking,
    },
    message: `Argument '${arg.name}' was added to directive '${
      directive.name
    }'`,
    path: `@${directive.name}`,
  };
}

export function directiveArgumentRemoved(
  directive: GraphQLDirective,
  arg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: `Argument '${arg.name}' was removed from directive '${
      directive.name
    }'`,
    path: `@${directive.name}.${arg.name}`,
  };
}

export function directiveArgumentDescriptionChanged(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: `Description for argument '${oldArg.name}' on directive '${
      directive.name
    }' changed from '${oldArg.description}' to '${newArg.description}'`,
    path: `@${directive.name}.${oldArg.name}`,
  };
}

export function directiveArgumentDefaultValueChanged(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
    },
    message:
      typeof oldArg.defaultValue === 'undefined'
        ? `Default value '${newArg.defaultValue}' was added to argument '${
            newArg.name
          }' on directive '${directive.name}'`
        : `Default value for argument '${oldArg.name}' on directive '${
            directive.name
          }' changed from '${oldArg.defaultValue}' to '${newArg.defaultValue}'`,
    path: `@${directive.name}.${oldArg.name}`,
  };
}

export function directiveArgumentTypeChanged(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change {
  return {
    criticality: safeChangeForInputValue(oldArg.type, newArg.type)
      ? {
          level: CriticalityLevel.NonBreaking,
          reason:
            'Changing an input field from non-null to null is considered non-breaking.',
        }
      : {
          level: CriticalityLevel.Breaking,
        },
    message: `Type for argument '${oldArg.name}' on directive '${
      directive.name
    }' changed from '${oldArg.type}' to '${newArg.type}'`,
    path: `@${directive.name}.${oldArg.name}`,
  };
}
