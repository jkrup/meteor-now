import 'babel-polyfill';
import fs from 'fs';
import Command from './command';
import logger from './logger';
import { dockerfile } from './dockerfile';
// required for async/await to work

const buildMeteorApp = async () => {
  const buildCommand = new Command('meteor build .meteor/local/builds --architecture=os.linux.x86_64');
  logger('building meteor app...');
  await buildCommand.run();
  logger('done building...');
};

const createDockerfile = async () => {
  const dockerfileContents = dockerfile.getContents();
  logger('creating Dockerfile...');
  new Promise((resolve, reject) => {
    fs.writeFile('.meteor/local/builds/Dockerfile', dockerfileContents, (err) => {
      if (err) {
        reject(err);
      }
      logger('done creating Dockerfile...');
      resolve();
    });
  });
};

const splitBuild = async () => {
  const splitCommand = new Command(`split -b 999999 .meteor/local/builds/${dockerfile.buildzip} .meteor/local/builds/x && rm .meteor/local/builds/${dockerfile.buildzip}`);
  logger('splitting up build');
  await splitCommand.run();
  logger('split up build');
};

const deployMeteorApp = async () => {
  const args = process.argv.slice(2).join(' ');
  const deployCommand = new Command(`cd .meteor/local/builds && now -e PORT=3000 ${args}`);
  logger('deploying using now service...');
  await deployCommand.run();
  logger('done deploying...');
};

const cleanup = async () => {
  const splitCommand = new Command('rm .meteor/local/builds/x* .meteor/local/builds/Dockerfile');
  logger('cleaning up .meteor/local dir');
  await splitCommand.run();
  logger('Done :)');
};

const main = async () => {
  try {
    await buildMeteorApp();
    await createDockerfile();
    await splitBuild();
    await deployMeteorApp();
    await cleanup();
  } catch (e) {
    console.error(e);
    // exit node process with error
    process.exit(1);
  }
}


export default function() {
  main();
}
