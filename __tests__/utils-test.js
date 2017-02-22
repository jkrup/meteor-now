import { getDependencies, getNodeEnv, didPassParam } from '../src/utils';


describe('Multiple args', () => {
  test('didPassParam("ROOT_URL") should return true', () => {
    process.argv = ['node', 'file', '-e', 'MONGO_URL=woeifhew', '-e', 'ROOT_URL=eowfiwehfawe'];
    expect(didPassParam('ROOT_URL')).toBe(true);
  });

  test('didPassParam(MONGO_URL) should return true', () => {
    process.argv = ['node', 'file', '-e', 'MONGO_URL=woeifhew', '-e', 'ROOT_URL=eowfiwehfawe'];
    expect(didPassParam('MONGO_URL')).toBe(true);
  });

  test('getNodeEnv should return production', () => {
    process.argv = ['node', 'file', '-e', 'MONGO_URL=woeifhew', '-e', 'ROOT_URL=eowfiwehfawe', '-e', 'NODE_ENV=production'];
    expect(getNodeEnv()).toBe('production');
  });
});

describe('Single args', () => {
  test('didPassParam("ROOT_URL") should return true', () => {
    process.argv = ['node', 'file', '-e', 'ROOT_URL=eowfiwehfawe'];
    expect(didPassParam('ROOT_URL')).toBe(true);
  });

  test('didPassParam(MONGO_URL) should return true', () => {
    process.argv = ['node', 'file', '-e', 'MONGO_URL=woeifhew'];
    expect(didPassParam('MONGO_URL')).toBe(true);
  });

  test('getNodeEnv should return production', () => {
    process.argv = ['node', 'file', '-e', 'NODE_ENV=production'];
    expect(getNodeEnv()).toBe('production');
  });
});

describe('No args', () => {
  test('didPassParam(ROOT_URL) should return false', () => {
    process.argv = ['node', 'file'];
    expect(didPassParam('ROOT_URL')).toBe(false);
  });
  test('didPassParam(MONGO_URL) should return false', () => {
    process.argv = ['node', 'file'];
    expect(didPassParam('MONGO_URL')).toBe(false);
  });
  test('getNodeEnv should return development', () => {
    process.argv = ['node', 'file'];
    expect(getNodeEnv()).toBe('development');
  });
});

describe('dependency arg', () => {
  test('no --dependencies', () => {
    process.argv = ['node', 'file'];
    expect(getDependencies()).toBe(false);
  });
  test('one --dependencies', () => {
    process.argv = ['node', 'file', '--dependencies', 'imagemagick'];
    expect(getDependencies()).toEqual(['imagemagick']);
  });
  test('multiple --dependencies', () => {
    process.argv = ['node', 'file', '--dependencies', 'imagemagick', '--dependencies', 'graphicsmagick'];
    expect(getDependencies()).toEqual(['imagemagick', 'graphicsmagick']);
  });
});

