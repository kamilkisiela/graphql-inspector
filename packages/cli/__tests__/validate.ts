import {validate} from '../src/commands/validate';
import {ConsoleRenderer, bolderize} from '../src/render';

const schema = './__tests__/assets/old.graphql';
const documents = './__tests__/assets/document.graphql';

function hasMessage(msg: string) {
  return (args: string[]) => args.join('').indexOf(msg) !== -1;
}

describe('validate', () => {
  const renderer = new ConsoleRenderer();
  let spyProcessExit: jest.SpyInstance;
  let spyEmit: jest.SpyInstance;

  beforeEach(() => {
    spyProcessExit = jest.spyOn(process, 'exit');
    spyProcessExit.mockImplementation();

    spyEmit = jest.spyOn(renderer, 'emit').mockImplementation(() => {});
  });

  afterEach(() => {
    spyProcessExit.mockRestore();
  });

  test('should load graphql files', async () => {
    await validate(documents, schema, {
      renderer,
      require: [],
      deprecated: false,
      noStrictFragments: false,
    });

    expect(
      spyEmit.mock.calls.find(hasMessage('Detected 1 invalid document:')),
    ).toBeDefined();

    expect(
      spyEmit.mock.calls.find(
        hasMessage('./__tests__/assets/document.graphql:'),
      ),
    ).toBeDefined();
    expect(
      spyEmit.mock.calls.find(
        hasMessage(
          bolderize(
            'Cannot query field "createdAtSomePoint" on type "Post".',
          ),
        ),
      ),
    ).toBeDefined();

    expect(
      spyEmit.mock.calls.find(hasMessage('All documents are valid')),
    ).not.toBeDefined();

    expect(spyProcessExit).toHaveBeenCalledWith(0);
  });
});
