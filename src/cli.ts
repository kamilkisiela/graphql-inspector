#!/usr/bin/env node

import * as commander from 'commander';
import {diff} from './cli/commands/diff';

commander
  .command('diff <old-schema> <new-schema>')
  .description('Diff two GraphQL schemas')
  .action(diff);

commander
  .command('check <documents> <schema>')
  .description('Check documents against the schema')
  .action(diff);

commander.parse(process.argv);
