import chalk from 'chalk';
import {renderChange, getSymbol} from '../../src/cli/render';
import {Change, CriticalityLevel} from '../../src/diff/changes/change';

test('render dangerous', () => {
  const change: Change = {
    criticality: {
      level: CriticalityLevel.Dangerous,
    },
    message: 'Ooo dangerous...',
    path: 'Type.field',
  };

  const [symbol, msg] = renderChange(change);

  expect(symbol).toBeDefined();
  expect(symbol).toEqual(getSymbol(CriticalityLevel.Dangerous));

  expect(msg).toBeDefined();
  expect(msg).toEqual(change.message);
});

test('render breaking', () => {
  const change: Change = {
    criticality: {
      level: CriticalityLevel.Breaking,
    },
    message: 'Boom, breaking',
    path: 'Type.field',
  };

  const [symbol, msg] = renderChange(change);

  expect(symbol).toBeDefined();
  expect(symbol).toEqual(getSymbol(CriticalityLevel.Breaking));

  expect(msg).toBeDefined();
  expect(msg).toEqual(change.message);
});

test('render non-breaking', () => {
  const change: Change = {
    criticality: {
      level: CriticalityLevel.NonBreaking,
    },
    message: 'Chill, non breaking',
    path: 'Type.field',
  };

  const [symbol, msg] = renderChange(change);

  expect(symbol).toBeDefined();
  expect(symbol).toEqual(getSymbol(CriticalityLevel.NonBreaking));

  expect(msg).toBeDefined();
  expect(msg).toEqual(change.message);
});

test('bold', () => {
  const change: Change = {
    criticality: {
      level: CriticalityLevel.Dangerous,
    },
    message: `Type 'Foo' changed its name to 'Bar'.`,
    path: 'Type.field',
  };

  const [, msg] = renderChange(change);

  expect(msg).toEqual(
    `Type ${chalk.bold('Foo')} changed its name to ${chalk.bold('Bar')}.`,
  );
});
