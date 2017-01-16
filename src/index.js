import fs from 'fs';
import Command from './Command';
import logger from './logger';
import { dockerfile } from './dockerfile';
// required for async/await to work
import 'babel-polyfill';

const main = async () => {
  try {
    await buildMeteorApp();
    await unpackBuiltApp();
    await createDockerfile();
    await deployMeteorApp();
  } catch (e) {
    console.error(e);
    // exit node process with error
    process.exit(1);
  }
}

const buildMeteorApp = async () => {
  const buildCommand = new Command('meteor build .meteor/local/builds --architecture os.linux.x86_64');
  logger('building meteor app...');
  await buildCommand.run();
  logger('done building...');
}

const unpackBuiltApp = async () => {
    const unpackCommand = new Command(`tar -xvzf .meteor/local/builds/${dockerfile.buildzip} -C .meteor/local`);
    logger(`Unpacking ${dockerfile.buildzip}`);
    await unpackCommand.run();
    logger('Finished Unpacking...');
}

const createDockerfile = async () => {
  const dockerfileContents = dockerfile.getContents();
  logger('creating Dockerfile...');
  new Promise(function(resolve, reject) {
    fs.writeFile('.meteor/local/bundle/Dockerfile', dockerfileContents, (err) => {
      if (err) {
        reject(err);
      }
      logger('done creating Dockerfile...');
      resolve();
    });
  });
}


const deployMeteorApp = async () => {
  const args = process.argv.slice(2).join(' ');
  const deployCommand = new Command(`cd .meteor/local/bundle && now -e PORT=3000 ${args}`);
  logger('deploying using now service...');
  await deployCommand.run();
  logger('done deploying...');
}

// TODO: const cleanup = async () = > {

main();
