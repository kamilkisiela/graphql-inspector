import { safeString } from '../../src/utils/string';

test('scalars', () => {
  expect(safeString(0)).toBe('0');
  expect(safeString(42)).toBe('42');
  expect(safeString(42.42)).toBe('42.42');
  expect(safeString('42')).toBe('42');
  expect(safeString('true')).toBe('true');
  expect(safeString(true)).toBe('true');
  expect(safeString('false')).toBe('false');
  expect(safeString(false)).toBe('false');
});

test('null', () => {
  expect(safeString(null)).toBe('null');
});

test('undefined', () => {
  expect(safeString(undefined)).toBe('undefined');
});

test('object', () => {
  expect(safeString({})).toBe('{}');
  expect(safeString(Object.create(null, { foo: { value: 42, enumerable: true } }))).toBe(
    '{ foo: 42 }',
  );
});

test('array', () => {
  expect(safeString(['42', '42'])).toBe("[ '42', '42' ]");
  expect(safeString([{}])).toBe('[ {} ]');
  expect(safeString([Object.create(null, { foo: { value: 42, enumerable: true } })])).toBe(
    '[ { foo: 42 } ]',
  );
});
