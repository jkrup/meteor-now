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
import { meteorNowBuildPath } from './constants';
import logger from './logger';
import { readFile, writeFile } from './files';

export const getNowJson = async () => {
  let nowJsonString;
  try {
    nowJsonString = await readFile('./now.json');
  } catch (e) {
    return null;
  }
  if (!nowJsonString) {
    return null;
  }
  return JSON.parse(nowJsonString);
};

export const getEnvVarFromNowJson = async (name) => {
  const nowJson = await getNowJson();
  if (!nowJson || !nowJson.env || !nowJson.env[name]) {
    return null;
  }
  return nowJson.env[name];
};

// construct an array of options to be passed to the now command
export const constructNowOptions = async () => {
  // get list of all environment variables user passed with the -e flag
  const environmentVariables = await getEnvironmentVariables();
  // construct the ROOT_URL variable
  const rootUrl =
    getEnvironmentVariable('ROOT_URL', environmentVariables) ||
    'http://localhost:3000';
  // construct the MONGO_URL variable
  const mongoUrl =
    getEnvironmentVariable('MONGO_URL', environmentVariables) ||
    'mongodb://127.0.0.1:27017';

  const remainingVariables = getRemainingVariables(environmentVariables);

  // options passed to the now cli tool. This array will be flattened
  // and will eventually be a string seperated by spaces.
  const options = [
    meteorNowBuildPath,
    ['-e', 'PORT=3000'],
    ...remainingVariables,
  ];

  if (!await getEnvVarFromNowJson('ROOT_URL')) {
    options.push(['-e', `ROOT_URL=${rootUrl}`]);
  }
  if (!await getEnvVarFromNowJson('MONGO_URL')) {
    options.push(['-e', `MONGO_URL=${mongoUrl}`]);
  }

  // construct the METEOR_SETTINGS, first by checking if user passed
  // -e METEOR_SETTINGS='{ "foo": "bar" }' option to meteor-now
  let meteorSettings = getEnvironmentVariable(
    'METEOR_SETTINGS',
    environmentVariables,
  );
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

export const prepareNowJson = async () => {
  const nowJson = await getNowJson();
  logger.debug('now.json', nowJson);
  await writeFile(
    `${meteorNowBuildPath}/now.json`,
    JSON.stringify(
      Object.assign(
        {
          features: {
            cloud: 'v1',
          },
        },
        nowJson,
      ),
    ),
  );
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
    const aliasDomain = getArg('alias');
    if (deploymentUrl && aliasDomain) {
      logger.info('Aliasing deployment to', aliasDomain);
      spawnProcess('now', ['alias', deploymentUrl, aliasDomain]);
      logger.succeed();
    }
  } catch (e) {
    logger.error('now cli process threw an error', e);
  }
};
