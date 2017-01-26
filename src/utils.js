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

const readFile = async path => new Promise((resolve) => {
  fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      logger(`could not read ${path}`);
      resolve(null);
    } else {
      resolve(data);
    }
  });
});

const writeFile = async (path, contents) => new Promise((resolve, reject) => {
  fs.writeFile(path, contents, (err) => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});

// Converts passed arguments into an object such that
// -e KEY=VALUE -e KEY=VAlUE --> {e: [[KEY, VALUE], [KEY, VALUE]]}
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

  if (args.e instanceof Array) {
    parsedEnvironmentArguments = args.e.map(arg => splitEnvironmentArgument(arg));
  } else {
    parsedEnvironmentArguments = [splitEnvironmentArgument(args.e)];
  }
  return {
    ...args,
    e: parsedEnvironmentArguments,
  };
};

const getParam = (param) => {
  const eArgs = getArgs().e || [];
  const paramObject = eArgs.find(arg => (arg[0] === param));
  return paramObject && paramObject[1];
};

const didPassParam = (param) => {
  const eArgs = getArgs().e || [];
  return !!eArgs.find(arg => (arg[0] === param));
};

const getNodeEnv = () => (getParam('NODE_ENV') || 'development');

const isDebug = () => getArgs().d === true;

const getBuildName = () => {
  const pwd = process.env.PWD;
  return pwd.split('/')[pwd.split('/').length - 1];
};

const getDependencies = () => {
  const args = minimist(process.argv.slice(2));
  let dependencies = [];
  if (!args.dependencies) {
    return false;
  }
  if (args.dependencies instanceof Array) {
    dependencies = args.dependencies;
  } else {
    dependencies = [args.dependencies];
  }
  return dependencies;
};

export {
  isStringJson,
  readFile,
  writeFile,
  getNodeEnv,
  didPassParam,
  getArgs,
  isDebug,
  getBuildName,
  getDependencies,
};
