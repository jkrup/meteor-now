import { spawnProcess } from './process';
import { getEnvironmentVariable, getEnvironmentVariables } from './args';
import { getMeteorSettings } from './meteor';
import { meteorNowBuildPath, projectName } from './constants';

export const deploy = async () => {
  const environmentVariables = await getEnvironmentVariables();
  const rootUrl =
    getEnvironmentVariable('ROOT_URL', environmentVariables) ||
    'http://localhost.com';
  const mongoUrl =
    getEnvironmentVariable('MONGO_URL', environmentVariables) ||
    'mongodb://127.0.0.1:27017';
  let meteorSettings = getEnvironmentVariable(
    'METEOR_SETTINGS',
    environmentVariables,
  );
  if (!meteorSettings) {
    meteorSettings = await getMeteorSettings();
  }
  const remainingVariables = getRemainingVariables(environmentVariables);
  const nowOptions = [
    meteorNowBuildPath,
    ['--name', projectName],
    ['-e', 'PORT=3000'],
    ['-e', `ROOT_URL=${rootUrl}`],
    ['-e', `MONGO_URL=${mongoUrl}`],
    ...remainingVariables,
    meteorSettings && ['-e', `METEOR_SETTINGS='${meteorSettings}'`],
  ];
  await spawnProcess('now', [].concat.apply([], nowOptions));
};

export const getRemainingVariables = environmentVariables => {
  return environmentVariables
    .filter(v => ['MONGO_URL', 'ROOT_URL', 'METEOR_SETTINGS'].indexOf(v.name) === -1)
    .map(v => ['-e', `${v.name}=${v.value}`]);
};
