import { useCommands } from '@graphql-inspector/commands';
import { useLoaders } from '@graphql-inspector/loaders';
import yargs, { Argv } from 'yargs';

async function main() {
  const config = {
    loaders: ['code', 'git', 'github', 'graphql', 'json', 'url'],
    commands: [
      'docs',
      'serve',
      'diff',
      'validate',
      'coverage',
      'introspect',
      'similar',
    ],
  };
  const loaders = useLoaders(config);
  const commands = await useCommands({config, loaders});

  const root: Argv = yargs
    .scriptName('graphql-inspector')
    .detectLocale(false)
    .epilog('Visit https://graphql-inspector.com for more information')
    .version()
    .options({
      r: {
        alias: 'require',
        describe: 'Require modules',
        type: 'array',
      },
      t: {
        alias: 'token',
        describe: 'Access Token',
        type: 'string',
      },
      h: {
        alias: 'header',
        describe: 'Http Header',
        type: 'array',
      },
      hl: {
        alias: 'left-header',
        describe: 'Http Header - Left',
        type: 'array',
      },
      hr: {
        alias: 'right-header',
        describe: 'Http Header - Right',
        type: 'array',
      },
    });

  commands
    .reduce((cli, cmd) => cli.command(cmd), root)
    .help()
    .showHelpOnFail(false).argv;
}

main();
