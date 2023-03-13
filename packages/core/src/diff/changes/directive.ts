import { DirectiveLocationEnum, GraphQLArgument, GraphQLDirective, isNonNullType } from 'graphql';
import { safeChangeForInputValue } from '../../utils/graphql';
import { safeString } from '../../utils/string';
import {
  Change,
  ChangeType,
  CriticalityLevel,
  DirectiveAdded,
  DirectiveDescriptionChanged,
  DirectiveRemoved,
} from './change';

function buildDirectiveRemovedMessage(directive: DirectiveRemoved): string {
  return `Directive '${directive.meta.removedDirectiveName}' was removed`;
}

export function directiveRemoved(directive: GraphQLDirective): Change<ChangeType.DirectiveRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.DirectiveRemoved,
    get message() {
      return buildDirectiveRemovedMessage(this);
    },
    path: `@${directive.name}`,
    meta: {
      removedDirectiveName: directive.name,
    },
  };
}

function buildDirectiveAddedMessage(directive: DirectiveAdded): string {
  return `Directive '${directive.meta.addedDirectiveName}' was added`;
}

export function directiveAdded(directive: GraphQLDirective): Change<ChangeType.DirectiveAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.DirectiveAdded,
    get message() {
      return buildDirectiveAddedMessage(this);
    },
    path: `@${directive.name}`,
    meta: {
      addedDirectiveName: directive.name,
    },
  };
}

function buildDirectiveDescriptionChangedMessage(directive: DirectiveDescriptionChanged): string {
  return `Directive '${directive.meta.directiveName}' description changed from '${
    directive.meta.oldDirectiveDescription ?? 'undefined'
  }' to '${directive.meta.newDirectiveDescription ?? 'undefined'}'`;
}

export function directiveDescriptionChanged(
  oldDirective: GraphQLDirective,
  newDirective: GraphQLDirective,
): Change<ChangeType.DirectiveDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.DirectiveDescriptionChanged,
    get message() {
      return buildDirectiveDescriptionChangedMessage(this);
    },
    path: `@${oldDirective.name}`,
    meta: {
      directiveName: oldDirective.name,
      oldDirectiveDescription: oldDirective.description ?? null,
      newDirectiveDescription: newDirective.description ?? null,
    },
  };
}

export function directiveLocationAdded(
  directive: GraphQLDirective,
  location: DirectiveLocationEnum,
): Change<ChangeType.DirectiveLocationAdded> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.DirectiveLocationAdded,
    message: `Location '${location}' was added to directive '${directive.name}'`,
    path: `@${directive.name}`,
    meta: {
      directiveName: directive.name,
      addedDirectiveLocation: location.toString(),
    },
  };
}

export function directiveLocationRemoved(
  directive: GraphQLDirective,
  location: DirectiveLocationEnum,
): Change<ChangeType.DirectiveLocationRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.DirectiveLocationRemoved,
    message: `Location '${location}' was removed from directive '${directive.name}'`,
    path: `@${directive.name}`,
    meta: {
      directiveName: directive.name,
      removedDirectiveLocation: location.toString(),
    },
  };
}

export function directiveArgumentAdded(
  directive: GraphQLDirective,
  arg: GraphQLArgument,
): Change<ChangeType.DirectiveArgumentAdded> {
  return {
    criticality: {
      level: isNonNullType(arg.type) ? CriticalityLevel.Breaking : CriticalityLevel.NonBreaking,
    },
    type: ChangeType.DirectiveArgumentAdded,
    message: `Argument '${arg.name}' was added to directive '${directive.name}'`,
    path: `@${directive.name}`,
    meta: {
      directiveName: directive.name,
      addedDirectiveArgumentName: arg.name,
      addedDirectiveArgumentType: arg.type.toString(),
    },
  };
}

export function directiveArgumentRemoved(
  directive: GraphQLDirective,
  arg: GraphQLArgument,
): Change<ChangeType.DirectiveArgumentRemoved> {
  return {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    type: ChangeType.DirectiveArgumentRemoved,
    message: `Argument '${arg.name}' was removed from directive '${directive.name}'`,
    path: `@${directive.name}.${arg.name}`,
    meta: {
      directiveName: directive.name,
      removedDirectiveArgumentName: arg.name,
      removedDirectiveArgumentType: arg.type.toString(),
    },
  };
}

export function directiveArgumentDescriptionChanged(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change<ChangeType.DirectiveArgumentDescriptionChanged> {
  return {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    type: ChangeType.DirectiveArgumentDescriptionChanged,
    message: `Description for argument '${oldArg.name}' on directive '${directive.name}' changed from '${oldArg.description}' to '${newArg.description}'`,
    path: `@${directive.name}.${oldArg.name}`,
    meta: {
      directiveName: directive.name,
      directiveArgumentName: oldArg.name,
      oldDirectiveArgumentDescription: oldArg.description ?? null,
      newDirectiveArgumentDescription: newArg.description ?? null,
    },
  };
}

export function directiveArgumentDefaultValueChanged(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change<ChangeType.DirectiveArgumentDefaultValueChanged> {
  return {
    criticality: {
      level: CriticalityLevel.Dangerous,
      reason:
        'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
    },
    type: ChangeType.DirectiveArgumentDefaultValueChanged,
    message:
      typeof oldArg.defaultValue === 'undefined'
        ? `Default value '${newArg.defaultValue}' was added to argument '${newArg.name}' on directive '${directive.name}'`
        : `Default value for argument '${oldArg.name}' on directive '${directive.name}' changed from '${oldArg.defaultValue}' to '${newArg.defaultValue}'`,
    path: `@${directive.name}.${oldArg.name}`,
    meta: {
      directiveName: directive.name,
      directiveArgumentName: oldArg.name,
      oldDirectiveArgumentDefaultValue: safeString(oldArg.defaultValue) ?? null,
      newDirectiveArgumentDefaultValue: safeString(newArg.defaultValue) ?? null,
    },
  };
}

export function directiveArgumentTypeChanged(
  directive: GraphQLDirective,
  oldArg: GraphQLArgument,
  newArg: GraphQLArgument,
): Change<ChangeType.DirectiveArgumentTypeChanged> {
  return {
    criticality: safeChangeForInputValue(oldArg.type, newArg.type)
      ? {
          level: CriticalityLevel.NonBreaking,
          reason: 'Changing an input field from non-null to null is considered non-breaking.',
        }
      : {
          level: CriticalityLevel.Breaking,
        },
    type: ChangeType.DirectiveArgumentTypeChanged,
    message: `Type for argument '${oldArg.name}' on directive '${directive.name}' changed from '${oldArg.type}' to '${newArg.type}'`,
    path: `@${directive.name}.${oldArg.name}`,
    meta: {
      directiveName: directive.name,
      directiveArgumentName: oldArg.name,
      oldDirectiveArgumentType: oldArg.type.toString(),
      newDirectiveArgumentType: newArg.type.toString(),
    },
  };
}
