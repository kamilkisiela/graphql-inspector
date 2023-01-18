import { diffArrays, isEqual, isNotEqual } from '../../src/utils/compare';

test('isEqual', () => {
  expect(isEqual('a', 'a')).toBe(true);
  expect(isEqual('a', 'b')).toBe(false);

  expect(isEqual(1, 1)).toBe(true);
  expect(isEqual(1, 1.0)).toBe(true);

  expect(isEqual(undefined, 1)).toBe(false);
  expect(isEqual(null, 1)).toBe(false);
  expect(isEqual(null, null)).toBe(true);

  expect(isEqual(['a'], ['a'])).toBe(true);
  expect(isEqual(['a'], ['A'])).toBe(false);
  expect(isEqual(['a'], [''])).toBe(false);
  expect(isEqual(['a'], ['aa'])).toBe(false);

  expect(isEqual([{ test: 'a' }], [{ test: 'a' }])).toBe(true);
  expect(isEqual([{ test: 'a' }], [{ test: 'b' }])).toBe(false);
  expect(isEqual([{ test: { deep: 'a' } }], [{ test: { deep: 'a' } }])).toBe(true);
  expect(isEqual([{ test: { deep: 'a' } }], [{ test: { deep: 'b' } }])).toBe(false);
  expect(isEqual([{ test: { deep: 'a' } }], [{ test: { deeper: 'a' } }])).toBe(false);
  expect(isEqual([{ test: { deep: 'a' } }], [{ test: { deep: 'a', twoKeys: 'b' } }])).toBe(false);
  expect(isEqual([{ test: { deep: 'a', twoKeys: 'b' } }], [{ test: { deep: 'a' } }])).toBe(false);
});

test('isNotEqual', () => {
  expect(isNotEqual('a', 'a')).toBe(false);
  expect(isNotEqual('a', 'b')).toBe(true);
});

test('diffArrays', () => {
  expect(diffArrays(['a'], ['a'])).toEqual([]);
  expect(diffArrays(['a'], ['a', 'b'])).toEqual([]);
  expect(diffArrays(['a', 'b'], ['a'])).toEqual(['b']);
  expect(diffArrays(['a', { test: { deep: 'b' } }], [{ test: { deep: 'c' } }])).toEqual([
    'a',
    { test: { deep: 'b' } },
  ]);
  expect(diffArrays(['a', { test: { deep: 'b' } }], [{ test: { deep: 'b' } }])).toEqual(['a']);
});
