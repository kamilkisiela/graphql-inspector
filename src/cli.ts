#!/usr/bin/env node

import * as commander from 'commander';

import {diff} from './cli/commands/diff';
import {validate} from './cli/commands/validate';
import {similar} from './cli/commands/similar';
import {serve} from './cli/commands/serve';
import {coverage} from './cli/commands/coverage';

commander
  .command('diff <old> <new>')
  .description('Diff two GraphQL schemas')
  .action(diff);

commander
  .command('validate <documents> <schema>')
  .description('Validate documents against a schema')
  .action(validate);

commander
  .command('similar <schema>')
  .option('-n, --type <s>', 'Name of a type')
  .option('-t, --threshold <n>', 'Threshold of similarity ratio', parseFloat)
  .description('Find similar types in a schema')
  .action((schema: string, cmd: commander.Command) => {
    similar(schema, cmd.type, cmd.threshold);
  });

commander
  .command('serve <schema>')
  .description('Serves a GraphQL API with GraphQL Playground')
  .action(serve);

commander
  .command('coverage <documents> <schema>')
  .description('Schema coverage based on documents')
  .action(coverage);

commander.parse(process.argv);
