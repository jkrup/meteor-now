import { spawnProcess } from './process';
import { getEnvironmentVariable } from './args';
import { getMeteorSettings } from './meteor';
import { meteorNowBuildPath, projectName } from './constants';

export const deploy = async () => {
  const rootUrl = getEnvironmentVariable('ROOT_URL') || 'http://localhost.com';
  const mongoUrl = getEnvironmentVariable('MONGO_URL') || 'mongodb://127.0.0.1:27017';
  let meteorSettings = getEnvironmentVariable('METEOR_SETTINGS');
  if (!meteorSettings) {
    meteorSettings = await getMeteorSettings();
  }
  const nowOptions = [
    meteorNowBuildPath,
    ['--name', projectName],
    ['-e', 'PORT=3000'],
    ['-e', `ROOT_URL=${rootUrl}`],
    ['-e', `MONGO_URL=${mongoUrl}`],
    meteorSettings && ['-e', `METEOR_SETTINGS='${meteorSettings}'`],
  ];
  await spawnProcess('now', [].concat.apply([], nowOptions));
};
