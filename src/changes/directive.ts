import {GraphQLDirective} from 'graphql';

import {Change, CriticalityLevel} from './change';

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
