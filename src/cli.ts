#!/usr/bin/env node

import * as commander from 'commander';

import {diff} from './cli/commands/diff';
import {validate} from './cli/commands/validate';
import {similar} from './cli/commands/similar';

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

commander.parse(process.argv);
