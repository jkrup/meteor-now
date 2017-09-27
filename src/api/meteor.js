import { spawnProcess } from './process';
import { meteorNowBuildPath } from './constants';
import { readFile } from './files';
import logger from './logger';

export const buildMeteorApp = async () => {
  logger('building meteor app');
  await spawnProcess(
    `meteor`,
    [
      'build',
      meteorNowBuildPath,
      shouldBeServerOnly() ? '--server-only' : '',
      '--architecture=os.linux.x86_64'
    ]
  );
  logger('done building');
};

export const getVersion = async () => {
  const release = await readFile('.meteor/release');
  return release.match(/METEOR@(.*)\r?\n/)[1];
};

export const getMicroVersion = async () => {
  const version = await getVersion();
  return version.split('.')[1];
};

export const shouldBeServerOnly = () =>
  parseInt(getMicroVersion(), 10) < 3 ? false : true;
