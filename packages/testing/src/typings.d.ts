declare module 'jsesc';
declare module 'strip-ansi';

interface CustomMatchers<R = unknown> {
  toHaveBeenCalledNormalized(expected: string): R;
}

declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Assertion extends CustomMatchers {}

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
