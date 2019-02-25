const request = jest.genMockFromModule('request');

let mocks: any = {};
let calls: any = {};

module.exports = {
  ...request,
  __resetMocks: () => {
    mocks = {};
    calls = {};
  },
  __registerUrlRequestMock: (url: string, content: any) => {
    mocks[url] = content;
  },
  __getCalls: (url: string) => {
    return calls[url] || [];
  },
  post: (options: any, cb: any) => {
    if (!calls[options.url]) {
      calls[options.url] = [];
    }

    calls[options.url].push(options);

    if (mocks[options.url]) {
      return cb(null, {}, {data: mocks[options.url]});
    } else {
      return cb(new Error('Invalid request'), {}, null);
    }
  },
};
