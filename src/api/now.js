import spawnProcess from './process';
import {
  getEnvironmentVariable,
  getEnvironmentVariables,
  getRemainingOptions,
  getRemainingVariables,
  flattenOptions,
  isDebug,
  getArg,
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
    getEnvironmentVariable('ROOT_URL', environmentVariables) || 'http://localhost:3000';
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
    options.push(flattenOptions(remainingOptions));
  }

  return options;
};

// deploy app with correct options
export const deploy = async () => {
  try {
    logger.info('Deploying build (this can take several minutes)');
    const nowOptions = await constructNowOptions();
    // spawn child process to execute now command. Flatten nowOptions
    // in order to properly pass all the options to now
    const deploymentUrl = await spawnProcess('now', flattenOptions(nowOptions));

    logger.succeed();
    if (!isDebug()) {
      logger.info(`App url is ${deploymentUrl}`);
      logger.succeed();
    }
    return deploymentUrl;
  } catch (e) {
    logger.error('Something went wrong with now', e);
    return null;
  }
};

// alias an app
export const alias = async (deploymentUrl) => {
  try {
    logger.info('Checking for alias option');
    logger.succeed();

    const aliasDomain = getArg('alias');
    console.log(deploymentUrl, aliasDomain);
    if (deploymentUrl && aliasDomain) {
      logger.info('Aliasing deployment to', aliasDomain);
      spawnProcess('now', ['alias', deploymentUrl, aliasDomain]);
      logger.succeed();
    }
  } catch (e) {
    logger.error('Something went wrong with now', e);
  }
};
