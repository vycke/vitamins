import logger from '../logger';

describe('logger', () => {
  let spy;
  const OLD_ENV = process.env;

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation();
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    spy.mockRestore();
    process.env = OLD_ENV;
  });

  jest.spyOn(global.console, 'log');
  it('test in development', () => {
    process.env.NODE_ENV = 'development';
    logger('test', 'tag');
    expect(console.log).toHaveBeenCalledTimes(1);
  });
  it('test in development', () => {
    logger('test');
    expect(console.log).toHaveBeenCalledTimes(0);
  });
});
