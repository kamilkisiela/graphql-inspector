#!/usr/bin/env node

import * as commander from 'commander';

import {diff} from './commands/diff';
import {validate} from './commands/validate';
import {similar} from './commands/similar';
import {serve} from './commands/serve';
import {coverage} from './commands/coverage';
import {introspect} from './commands/introspect';
import {normalizeOptions} from './utils/options';

commander.option('-r, --require <s...>', 'Require modules');

commander
  .command('diff <old> <new>')
  .description('Diff two schemas')
  .action((oldSchema: string, newSchema: string, cmd: commander.Command) =>
    diff(oldSchema, newSchema, normalizeOptions(cmd)),
  );

commander
  .command('validate <documents> <schema>')
  .description('Validate documents against a schema')
  .action((documents: string, schema: string, cmd: commander.Command) =>
    validate(documents, schema, normalizeOptions(cmd)),
  );

commander
  .command('similar <schema>')
  .option('-n, --type <s>', 'Name of a type')
  .option('-t, --threshold <n>', 'Threshold of similarity ratio', parseFloat)
  .description('Find similar types in a schema')
  .action((schema: string, cmd: commander.Command) => {
    similar(schema, cmd.type, cmd.threshold, normalizeOptions(cmd));
  });

commander
  .command('serve <schema>')
  .description('Serves a GraphQL API with Playground')
  .action((schema: string, cmd: commander.Command) =>
    serve(schema, normalizeOptions(cmd)),
  );

commander
  .command('coverage <documents> <schema>')
  .option('-s, --silent', 'Do not render any stats in the terminal')
  .option('-w, --write <s>', 'Write a file with coverage stats')
  .description('Schema coverage based on documents')
  .action((documents: string, schema: string, cmd: commander.Command) =>
    coverage(documents, schema, normalizeOptions(cmd)),
  );

commander
  .command('introspect <schema>')
  .description('Introspect a schema')
  .action((schema: string, cmd: commander.Command) =>
    introspect(schema, normalizeOptions(cmd)),
  );

commander.command('*').action(() => commander.help());

commander.parse(process.argv);
