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

export {
  isStringJson,
  readFile,
  getNodeEnv,
  didPassInMeteorSettings,
};
