import spawnProcess from './process';
import {
  getEnvironmentVariable,
  getEnvironmentVariables,
  getRemainingOptions,
  getRemainingVariables,
  flattenOptions,
} from './args';
import { getMeteorSettings } from './meteor';
import { meteorNowBuildPath, projectName } from './constants';
import logger from './logger';

// construct an array of options to be passed to the now command
export const constructNowOptions = async () => {
  // get list of all environment variables user passed with the -e flag
  const environmentVariables = await getEnvironmentVariables();
  // construct the ROOT_URL variable
  const rootUrl =
    getEnvironmentVariable('ROOT_URL', environmentVariables) || 'http://localhost.com';
  // construct the MONGO_URL variable
  const mongoUrl =
    getEnvironmentVariable('MONGO_URL', environmentVariables) || 'mongodb://127.0.0.1:27017';

  const remainingVariables = getRemainingVariables(environmentVariables);

  // options passed to the now cli tool. This array will be flattened
  // and will eventually be a string seperated by spaces.
  const options = [
    meteorNowBuildPath,
    ['--name', projectName],
    ['-e', 'PORT=3000'],
    ['-e', `ROOT_URL=${rootUrl}`],
    ['-e', `MONGO_URL=${mongoUrl}`],
    ...remainingVariables,
  ];

  // construct the METEOR_SETTINGS, first by checking if user passed
  // -e METEOR_SETTINGS='{ "foo": "bar" }' option to meteor-now
  let meteorSettings = getEnvironmentVariable('METEOR_SETTINGS', environmentVariables);
  // if not, check if still no METEOR_SETTINGS exist
  if (!meteorSettings) {
    // check if NODE_ENV is passed and look for production.settings.json file
    meteorSettings = await getMeteorSettings();
  }
  if (meteorSettings) {
    options.push(['-e', `METEOR_SETTINGS='${meteorSettings}'`]);
  }

  // get any remaining custom flags passed in by user
  const remainingOptions = getRemainingOptions();
  if (remainingOptions) {
    options.push(remainingOptions);
  }

  return options;
};

// deploy app with correct options
export const deploy = async () => {
  logger('deploying app');
  const nowOptions = await constructNowOptions();
  // spawn child process to execute now command. Flatten nowOptions
  // in order to properly pass all the options to now
  // eslint-disable-next-line
  await spawnProcess('now', flattenOptions(nowOptions));
};
