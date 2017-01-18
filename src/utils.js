import fs from 'fs';
import minimist from 'minimist';
import logger from './logger';

const isStringJson = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

const readFile = async (path) => {
  return new Promise((resolve) => {
    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        logger(`could not read ${path}`);
        resolve(null)
      } else {
        resolve(data);
      }
    });
  });
};

const getNodeEnv = () => {
  const args = minimist(process.argv.slice(2));
  let env = 'development';
  try {
    env = args.e
      .filter(arg => arg.split('=')[0] === 'NODE_ENV')[0].split('=')[1];
  } catch (e) {
    // NODE_ENV was not passed in (-e NODE_ENV=production)
    // ignore error, nodeEnv will be 'development'
  }
  return env;
};

const didPassInMeteorSettings = () => {
  const args = minimist(process.argv.slice(2));
  try {
    // TODO possibly better way of doing this
    args.e
      .filter(arg => arg.split('=')[0] === 'METEOR_SETTINGS')[0].split('=')[1];
  } catch (e) {
    // METEOR_SETTINGS argument was not passed
    return false;
  }
  return true;
};

const getArgs = () => {
  const args = minimist(process.argv.slice(2));

  if (!args.e) {
    // no -e flag was passed
    return args;
  }

  // handle -e arguments. minimist returns a string to args.e if single flag is passed
  // and array if multiple are passed. This handles it so that getArgs() always returns
  // array for args.e regardless if one or more environment variables were passed
  let parsedEnvironmentArguments = [];
  const splitEnvironmentArgument = arg => arg.split('=');
  if (args.e && args.e instanceof Array) {
    parsedEnvironmentArguments = args.e.map(arg => splitEnvironmentArgument(arg));
  } else {
    parsedEnvironmentArguments = splitEnvironmentArgument(args.e);
  }
  return {
    ...args,
    e: parsedEnvironmentArguments,
  };
};

const isDebug = () => getArgs().d === true;

export {
  isStringJson,
  readFile,
  getNodeEnv,
  didPassInMeteorSettings,
  getArgs,
  isDebug,
};
