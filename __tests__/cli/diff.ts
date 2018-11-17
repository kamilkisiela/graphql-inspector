import {diff} from '../../src/cli/commands/diff';
import {ConsoleRenderer} from '../../src/cli/render';

const oldSchema = '../assets/old.graphql';
const newSchema = '../assets/new.graphql';

function hasMessage(msg: string) {
  return (args: string[]) => args.join('').indexOf(msg) !== -1;
}

describe('cli/diff', () => {
  const renderer = new ConsoleRenderer();
  let spyProcessExit: jest.SpyInstance;
  let spyProcessCwd: jest.SpyInstance;
  let spyEmit: jest.SpyInstance;

  beforeEach(() => {
    spyProcessExit = jest.spyOn(process, 'exit');
    spyProcessExit.mockImplementation();

    spyProcessCwd = jest
      .spyOn(process, 'cwd')
      .mockImplementation(() => __dirname);

    spyEmit = jest.spyOn(renderer, 'emit').mockImplementation(() => {});
  });

  afterEach(() => {
    spyProcessExit.mockRestore();
    spyProcessCwd.mockRestore();
  });

  test('should load graphql file', async () => {
    await diff(oldSchema, oldSchema, {
      renderer,
    });

    expect(
      spyEmit.mock.calls.find(hasMessage('No changes detected')),
    ).toBeDefined();

    expect(
      spyEmit.mock.calls.find(hasMessage('Detected the following changes')),
    ).not.toBeDefined();

    expect(spyProcessExit).toHaveBeenCalledWith(0);
  });

  test('should load different schema from graphql file', async () => {
    await diff(oldSchema, newSchema, {
      renderer,
    });

    expect(
      spyEmit.mock.calls.find(hasMessage('No changes detected')),
    ).not.toBeDefined();

    expect(
      spyEmit.mock.calls.find(hasMessage('Detected the following changes (4) between schemas:')),
    ).toBeDefined();

    expect(spyProcessExit).toHaveBeenCalledWith(1);
  });
});
