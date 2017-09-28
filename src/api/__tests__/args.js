import { getArg, getEnvironmentVariables } from '../args';

describe('args test', () => {
  test('it should return correct arg', () => {
    process.argv = ['node', '-e', 'MONGO_URL=mongodb://127.0.0.1:27017', '--deps', 'imagemagick'];
    const arg = getArg('deps');
    expect(arg).toBe('imagemagick');
  });

  test('it should return correct number of environment variables', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost.com',
      '--deps',
      'abc',
    ];
    const environmentVariables = getEnvironmentVariables();
    expect(environmentVariables.length).toBe(2);
  });
  test('it should return all environment variables', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost.com',
      '--deps',
      'abc',
    ];
    const environmentVariables = getEnvironmentVariables();
    expect(environmentVariables).toEqual([
      { name: 'MONGO_URL', value: 'mongodb://127.0.0.1:27017' },
      { name: 'ROOT_URL', value: 'http://localhost.com' },
    ]);
  });
});
