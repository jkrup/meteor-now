// required for async/await to work
import 'babel-polyfill';
import colors from 'colors';
import _ from 'lodash';
import splitFile from 'split-file';
import del from 'delete';
import nowClient from 'now-client';
import spinner from './spinner';
import Command from './command';
import logger from './logger';
import { dockerfile } from './dockerfile';
import { readFile, writeFile, isStringJson, getNodeEnv, didPassParam } from './utils';

let meteorSettingsVar;

const buildMeteorApp = async () => {
  const message = 'building meteor app';
  spinner.start(`${message} (this can take several minutes)`);
  const buildCommand = new Command(`meteor build .meteor/local/builds ${dockerfile.serverOnly} --architecture=os.linux.x86_64`);
  await buildCommand.run();
  spinner.succeed(message);
};


const createDockerfile = async () => {
  const dockerfileContents = dockerfile.getContents(didPassParam('MONGO_URL'));
  logger('creating Dockerfile');
  await writeFile('.meteor/local/builds/Dockerfile', dockerfileContents);
};

const createSupervisorFile = async () => {
  logger('creating supervisor');
  await writeFile('.meteor/local/builds/supervisord.conf', dockerfile.getSupervisor());
};

const splitBuild = async () => {
  logger('splitting bundle');
  await new Promise((resolve, reject) => {
    splitFile.splitFileBySize(`.meteor/local/builds/${dockerfile.buildzip}`, 999999, async (err, names) => {
      if (err) {
        reject(err);
      }
      // delete original bundle file so that it doesnt get uploaded to now
      await del.promise([`.meteor/local/builds/${dockerfile.buildzip}`]);
      resolve(names);
    });
  });
};

const handleMeteorSettings = async () => {
  if (!didPassParam('METEOR_SETTINGS')) {
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
  const message = 'deploying build';
  let mongoUrl = '';
  if (!didPassParam('MONGO_URL')) {
    console.log(colors.yellow('WARNING: Did not pass a MONGO_URL. Bundling a NON-PRODUCTION version of MongoDB with your application. Read about the limitations here: https://git.io/vM72E')); // eslint-disable-line no-console
    mongoUrl = '-e MONGO_URL=mongodb://127.0.0.1:27017';
  }
  spinner.start(`${message} (this can take several minutes)`);
  const args = process.argv.slice(2).join(' ');
  const meteorSettingsArg = meteorSettingsVar ? `-e METEOR_SETTINGS='${meteorSettingsVar}'` : '';
  const rootUrl = !didPassParam('ROOT_URL') ? '-e ROOT_URL=http://localhost.com' : '';
  const deployCommand = new Command(`cd .meteor/local/builds && now -e PORT=3000 ${mongoUrl} ${rootUrl} ${args} ${meteorSettingsArg}`);
  await deployCommand.run();
  spinner.succeed(message);
};

const getDeploymentUrl = async () => {
  logger('getting deployment url...');
  const now = nowClient();
  let deployments;
  try {
    deployments = await now.getDeployments();
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
  // get latest deployment url from the list
  const sortedDeployments = _.sortBy(deployments, 'created');
  return sortedDeployments[sortedDeployments.length - 1];
};

const cleanup = async () => {
  logger('cleaning up');
  await del.promise(['.meteor/local/builds/*']);
};

const prepareForUpload = async () => {
  spinner.start('preparing build');
  await createDockerfile();
  if (!didPassParam('MONGO_URL')) {
    await createSupervisorFile();
  }
  await splitBuild();
  await handleMeteorSettings();
  spinner.succeed();
};

const main = async () => {
  try {
    await buildMeteorApp();
    await prepareForUpload();
    await deployMeteorApp();
    const deployment = await getDeploymentUrl();
    await cleanup();
    spinner.succeed(`meteor app deployed to ${deployment.url}`);
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
