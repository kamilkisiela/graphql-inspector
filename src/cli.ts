#!/usr/bin/env node

import * as commander from 'commander';

import {diff} from './cli/commands/diff';
import {validate} from './cli/commands/validate';

commander
  .command('diff <old> <new>')
  .description('Diff two GraphQL schemas')
  .action(diff);

commander
  .command('validate <documents> <schema>')
  .description('Validate documents against the schema')
  .action(validate);

commander.parse(process.argv);
