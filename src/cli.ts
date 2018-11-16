#!/usr/bin/env node

import * as commander from 'commander';
import {execute} from './cli/execute';

const program = commander
  .usage('<old> <new>')
  .description('Compare two schemas')
  .action(execute);

program.parse(process.argv);
