import os from 'os';
import { constructNowOptions } from '../now';

describe('now test', () => {
  test('it should construct the correct now options', async () => {
    process.argv = ['node', '-e', 'MONGO_URL=mongodb://127.0.0.1:27017', '--deps', 'imagemagick', '-e', 'METEOR_SETTINGS=\'{ "foo": "bar" }\''];
    const nowOptions = await constructNowOptions();
    expect(nowOptions).toEqual([
      `${os.homedir()}/.meteor-now/build`,
      ['-e', 'PORT=3000'],
      ['-e', 'ROOT_URL=http://localhost:3000'],
      ['-e', 'MONGO_URL=mongodb://127.0.0.1:27017'],
      ['-e', 'METEOR_SETTINGS=\'\'{ "foo": "bar" }\'\''], [],
    ]);
  });

  test('it should construct the correct environment variables', async () => {
    process.argv = ['node', '-e', 'MONGO_URL=mongodb://127.0.0.1:27017', '--deps', 'imagemagick', '-e', 'METEOR_SETTINGS=\'{ "foo": "bar" }\'', '-e', 'MAGIC_VAR=magical'];
    const nowOptions = await constructNowOptions();
    expect(nowOptions).toEqual([
      `${os.homedir()}/.meteor-now/build`,
      ['-e', 'PORT=3000'],
      ['-e', 'MAGIC_VAR=magical'],
      ['-e', 'ROOT_URL=http://localhost:3000'],
      ['-e', 'MONGO_URL=mongodb://127.0.0.1:27017'],
      ['-e', 'METEOR_SETTINGS=\'\'{ "foo": "bar" }\'\''], [],
    ]);
  });
});
