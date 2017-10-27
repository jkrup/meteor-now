import {
  getArg,
  getArgs,
  getEnvironmentVariables,
  getEnvironmentVariable,
  getRemainingVariables,
  getRemainingOptions,
  flattenOptions,
} from '../args';

describe('args test', () => {
  test('it should return correct arg', () => {
    process.argv = ['node', '-e', 'MONGO_URL=mongodb://127.0.0.1:27017', '--deps', 'imagemagick'];
    const arg = getArg('deps');
    expect(arg).toBe('imagemagick');
  });

  test('it should return all default args', () => {
    process.argv = ['node', '-e', 'MONGO_URL=mongodb://127.0.0.1:27017', '--deps', 'imagemagick'];
    const args = getArgs();
    expect(args).toEqual({
      $0: '-e',
      _: ['node'],
      help: false,
      version: false,
      deps: 'imagemagick',
      e: 'MONGO_URL=mongodb://127.0.0.1:27017',
    });
  });

  test('it should return all args when passed an argv', () => {
    const args = getArgs([
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '--deps',
      'imagemagick',
      '--public',
    ]);
    expect(args).toEqual({
      $0: '-e',
      _: ['node'],
      help: false,
      version: false,
      deps: 'imagemagick',
      e: 'MONGO_URL=mongodb://127.0.0.1:27017',
      public: true,
    });
  });

  test('it should return correct number of environment variables', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost:3000',
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
      'ROOT_URL=http://localhost:3000',
      '--deps',
      'abc',
    ];
    const environmentVariables = getEnvironmentVariables();
    expect(environmentVariables).toEqual([
      { name: 'MONGO_URL', value: 'mongodb://127.0.0.1:27017' },
      { name: 'ROOT_URL', value: 'http://localhost:3000' },
    ]);
  });

  test('it should return a environment variable by name', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost:3000',
      '--deps',
      'abc',
    ];
    const environmentVariables = getEnvironmentVariable('ROOT_URL');
    expect(environmentVariables).toBe('http://localhost:3000');
  });

  test('it should return all custom environment variables', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost:3000',
      '-e',
      'MY_SPECIAL_VAR=cats',
      '-e',
      'SECRET=litter',
      '--deps',
      'abc',
    ];
    const remainingVariables = getRemainingVariables();
    expect(remainingVariables).toEqual([['-e', 'MY_SPECIAL_VAR=cats'], ['-e', 'SECRET=litter']]);
  });

  test('it should return all custom options', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost:3000',
      '-e',
      'MY_SPECIAL_VAR=cats',
      '-e',
      'SECRET=litter',
      '--deps',
      'abc',
      '--public',
      '--alias',
      'abc.com',
    ];
    const remainingOptions = getRemainingOptions();
    expect(remainingOptions).toEqual([['--public'], ['--alias', 'abc.com']]);
  });

  test('it should correctly flatten options', () => {
    const flattenedOptions = flattenOptions([
      '--public',
      ['-e', 'MONGO_URL=mongodb://127.0.0.1:27017'],
      ['--alias', 'abc.com'],
    ]);
    expect(flattenedOptions).toEqual([
      '--public',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '--alias',
      'abc.com',
    ]);
  });


  test('it should ignore certain flags', () => {
    process.argv = [
      'node',
      '-e',
      'MONGO_URL=mongodb://127.0.0.1:27017',
      '-e',
      'ROOT_URL=http://localhost:3000',
      '-e',
      'MY_SPECIAL_VAR=cats',
      '-e',
      'SECRET=litter',
      '--deps',
      'abc',
      '--nosplit',
    ];
    const remainingVariables = getRemainingVariables();
    expect(remainingVariables).toEqual([['-e', 'MY_SPECIAL_VAR=cats'], ['-e', 'SECRET=litter']]);
  });
});
