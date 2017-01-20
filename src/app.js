// required for async/await to work
import 'babel-polyfill';
import fs from 'fs';
import spinner from './spinner';
import Command from './command';
import logger from './logger';
import { dockerfile } from './dockerfile';
import { readFile, isStringJson, getNodeEnv, didPassInMeteorSettings, didPassInMongoUrl, didPassInRootUrl } from './utils';

let meteorSettingsVar;

const buildMeteorApp = async () => {
  const message = 'building meteor app';
  spinner.start(`${message} (this may take several minutes)`);
  const buildCommand = new Command('meteor build .meteor/local/builds --architecture=os.linux.x86_64');
  await buildCommand.run();
  spinner.succeed(message);
};


const createDockerfile = async () => {
  const dockerfileContents = dockerfile.getContents(didPassInMongoUrl());
  logger('creating Dockerfile');
  return new Promise((resolve, reject) => {
    fs.writeFile('.meteor/local/builds/Dockerfile', dockerfileContents, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const createSupervisorFile = async () => {
  logger('creating supervis')
  return new Promise((resolve, reject) => {
    fs.writeFile('.meteor/local/builds/supervisord.conf',
    `
[supervisord]
nodaemon=true
loglevel=debug

[program:mongo]
command=mongod

[program:node]
command=node "/usr/src/app/bundle/main.js"`, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

}

const splitBuild = async () => {
  logger('splitting bundle');
  const splitCommand = new Command(`split -b 999999 .meteor/local/builds/${dockerfile.buildzip} .meteor/local/builds/x && rm .meteor/local/builds/${dockerfile.buildzip}`);
  await splitCommand.run();
};

const handleMeteorSettings = async () => {
  if (!didPassInMeteorSettings()) {
    const env = getNodeEnv();
    const settingsFile = `${env}.settings.json`;
    logger(`looking for meteor settings file ${settingsFile} in root of project`);
    const settingsString = await readFile(settingsFile);
    if (settingsString) {
      // settings file found
      if (!isStringJson(settingsString)) {
        throw new Error(`ERROR: ${settingsFile} file is not valid JSON`);
      } else {
        meteorSettingsVar = settingsString.replace(/[\n ]/g, '');
        logger('found settings file');
      }
    } else {
      logger('no settings file found');
    }
  }
};

const deployMeteorApp = async () => {
  const message = 'deploying app';
  spinner.start(`${message} (this may take several minutes)`);
  const args = process.argv.slice(2).join(' ');
  const meteorSettingsArg = meteorSettingsVar ? `-e METEOR_SETTINGS='${meteorSettingsVar}'` : '';
  const mongoUrl = !didPassInMongoUrl() ? '-e MONGO_URL=mongodb://127.0.0.1:27017' : '';
  const rootUrl = !didPassInRootUrl() ? '-e ROOT_URL=http://localhost.com' : '';
  const deployCommand = new Command(`cd .meteor/local/builds && now -e PORT=3000 ${mongoUrl} ${rootUrl} ${args} ${meteorSettingsArg}`);
  const stdOut = await deployCommand.run();
  const deployedAppUrl = stdOut.out.toString();
  spinner.succeed(message);
  return deployedAppUrl;
};

const cleanup = async () => {
  logger('cleaning up');
  const splitCommand = new Command('rm .meteor/local/builds/x* .meteor/local/builds/Dockerfile');
  await splitCommand.run();
};

const prepareForUpload = async () => {
  spinner.start('preparing build for deployment');
  await createDockerfile();
  if (!didPassInMongoUrl()) {
    await createSupervisorFile();
  }
  await splitBuild();
  await handleMeteorSettings();
  spinner.succeed();
};

const main = async () => {
  try {
    await cleanup();
    await buildMeteorApp();
    await prepareForUpload();
    const appUrl = await deployMeteorApp();
    spinner.succeed(`meteor app deployed to ${appUrl}`);
  } catch (e) {
    spinner.fail();
    console.error(e); // eslint-disable-line no-console
    // exit node process with error
    process.exit(1);
  }
};


export default function () {
  main();
}
