// required for async/await to work
import 'babel-polyfill';
import fs from 'fs';
import spinner from './spinner';
import Command from './command';
import logger from './logger';
import { dockerfile } from './dockerfile';
import { readFile, isStringJson, getNodeEnv, didPassInMeteorSettings, didPassInMongoUrl } from './utils';

let meteorSettingsVar;

const buildMeteorApp = async () => {
  spinner.start('building meteor app');
  const buildCommand = new Command('meteor build .meteor/local/builds --architecture=os.linux.x86_64');
  await buildCommand.run();
  spinner.succeed();
};

const createDockerfile = async () => {
  const dockerfileContents = dockerfile.getContents(!didPassInMongoUrl);
  spinner.start('creating Dockerfile');
  return new Promise((resolve, reject) => {
    fs.writeFile('.meteor/local/builds/Dockerfile', dockerfileContents, (err) => {
      if (err) {
        reject(err);
      }
      spinner.succeed();
      resolve();
    });
  });
};

const splitBuild = async () => {
  spinner.start('preparing build for upload');
  const splitCommand = new Command(`split -b 999999 .meteor/local/builds/${dockerfile.buildzip} .meteor/local/builds/x && rm .meteor/local/builds/${dockerfile.buildzip}`);
  await splitCommand.run();
  spinner.succeed();
};

const handleMeteorSettings = async () => {
  spinner.start('checking for meteor settings file');
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
  spinner.succeed();
};

const deployMeteorApp = async () => {
  spinner.start('deploying using now service (this may take several minutes)');
  const args = process.argv.slice(2).join(' ');
  const meteorSettingsArg = meteorSettingsVar ? `-e METEOR_SETTINGS='${meteorSettingsVar}'` : '';
  const deployCommand = new Command(`cd .meteor/local/builds && now -e PORT=3000 ${args} ${meteorSettingsArg}`);
  await deployCommand.run();
  spinner.setMessage(`meteor app deployed :)`);
  spinner.succeed();
};

const cleanup = async () => {
  spinner.start('cleaning up .meteor/local dir');
  const splitCommand = new Command('rm .meteor/local/builds/x* .meteor/local/builds/Dockerfile');
  await splitCommand.run();
  spinner.succeed();
};

const main = async () => {
  try {
    await buildMeteorApp();
    await createDockerfile();
    await splitBuild();
    await handleMeteorSettings();
    await deployMeteorApp();
    await cleanup();
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
