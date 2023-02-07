import { calculateTokenCount } from '../../src';

describe('calculateDepth', () => {
  it('calculate easy operation', () => {
    const source = `{brrt}`;
    const count = calculateTokenCount({
      source,
      getReferencedFragmentSource: () => {
        throw new Error('noop');
      },
    });
    expect(count).toEqual(3);
  });
  it('calculate another easy operation', () => {
    const source = `query{brrt}`;
    const count = calculateTokenCount({
      source,
      getReferencedFragmentSource: () => {
        throw new Error('noop');
      },
    });
    expect(count).toEqual(4);
  });
  it('calculate with external fragment', () => {
    const source = `query{...Swag}`;
    const count = calculateTokenCount({
      source,
      getReferencedFragmentSource: name => {
        if (name === 'Swag') {
          return `fragment Swag on Query{brrt}`;
        }
        throw new Error('noop');
      },
    });
    expect(count).toEqual(12);
  });
});
