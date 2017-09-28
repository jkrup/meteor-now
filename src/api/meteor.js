import { spawnProcess } from './process';
import { meteorNowBuildPath } from './constants';
import { readFile } from './files';
import { getEnvironmentVariable } from './args';
import logger from './logger';

export const buildMeteorApp = async () => {
  logger('building app');
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

export const getMeteorSettings = async () => {
  const nodeEnv = getEnvironmentVariable('NODE_ENV');
  if (nodeEnv) {
    const settingsFilePath = `${nodeEnv}.settings.json`;
    try {
      const settingsFile = await readFile(settingsFilePath);
      return settingsFile.replace(/\r?\n|\r/g, '');
    } catch (e) {
      throw e;
    }
  }
  return null;
}

export const shouldBeServerOnly = () =>
  parseInt(getMicroVersion(), 10) < 3 ? false : true;
