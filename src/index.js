import fs from 'fs';
import Command from './Command';
import logger from './logger';
import Dockerfile from './Dockerfile';
require('babel-polyfill');
// Meteor 1.3.x and earlier


const main = async () => {
  console.log('foo');
  // await buildMeteorApp();
  // await createDockerfile();
  // await deployMeteorApp();
}

const buildMeteorApp = async () => {
  const buildCommand = new Command('meteor build .meteor/local/builds');
  logger('building meteor app...');
  await buildCommand.run();
  logger('done building...');
}

const createDockerfile = async () => {
  const dockerfileContents = Dockerfile.getContents();
  logger('creating Dockerfile...');
  new Promise(function(resolve, reject) {
    fs.writeFile('.meteor/local/builds/Dockerfile', dockerfileContents, (err) => {
      if (err) {
        reject(err);
      }
      logger('done creating Dockerfile...');
      resolve();
    });
  });
}

const deployMeteorApp = async () => {
  const deployCommand = new Command('cd .meteor/local/builds && now -e ROOT_URL=http://example.com');
  logger('deploying using now service...');
  await deployCommand.run();
  logger('done deploying...');
}

main();
