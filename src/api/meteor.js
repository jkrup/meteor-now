import { spawnProcess } from './process';
import { meteorNowBuildPath } from './constants';
import { readFile } from './files';
import { getEnvironmentVariable } from './args';
import logger from './logger';

// build the meteor app by using meteor build
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

// get the full meteor release version
export const getVersion = async () => {
  const release = await readFile('.meteor/release');
  return release.match(/METEOR@(.*)\r?\n/)[1];
};

// get the minor version number of the meteor release
export const getMicroVersion = async () => {
  const version = await getVersion();
  return version.split('.')[1];
};

// get meteor settings by checking for settings.json files
// uses NODE_ENV to determine which settings file to load
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

// check to see if server only flag should be
// passed to meteor build
export const shouldBeServerOnly = () =>
  parseInt(getMicroVersion(), 10) < 3 ? false : true;
