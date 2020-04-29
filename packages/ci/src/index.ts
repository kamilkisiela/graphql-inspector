import {useConfig, availableCommands} from '@graphql-inspector/config';
import {useCommands} from '@graphql-inspector/commands';
import {useLoaders} from '@graphql-inspector/loaders';
import yargs, {Argv} from 'yargs';
import {Logger} from '@graphql-inspector/logger';

async function main() {
  const config = await useConfig();
  const loaders = useLoaders(config);
  const commands = useCommands({config, loaders});

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
    });

  commands
    .reduce((cli, cmd) => cli.command(cmd), root)
    .demandCommand()
    .recommendCommands()
    .help()
    .showHelpOnFail(false)
    .fail((msg, error) => {
      if (msg) {
        if (msg.includes('Unknown argument:')) {
          const commandName = msg
            .replace('Unknown argument: ', '')
            .toLowerCase();

          Logger.error(`Command '${commandName}' not found`);

          if (availableCommands.includes(commandName)) {
            Logger.log(
              `  Try to install @graphql-inspector/${commandName}-command`,
            );
          }
        } else if (msg.includes('Not enough')) {
          Logger.error(msg);
          Logger.info('Specify --help for available options');
        } else {
          Logger.error(msg);
        }
      }

      if (error) {
        Logger.error(error.message);
        console.error(error);
      }

      process.exit(1);
    })
    .strict(true).argv;
}

main();
