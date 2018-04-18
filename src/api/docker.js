import { writeFile } from './files';
import logger from './logger';
import { meteorNowBuildPath, projectName } from './constants';
import { getMicroVersion } from './meteor';
import { getEnvironmentVariable, getArg } from './args';

// get docker image version
export const getDockerImage = () => {
  const dockerImage = getArg('docker-image');
  if (dockerImage) {
    return dockerImage;
  }
  if (parseInt(getMicroVersion(), 10) < 4) {
    return 'nodesource/jessie:0.10.43';
  }
  return 'node:8.9.4';
};

// check if mongo url was passed as a env var
export const shouldIncludeMongo = () => !getEnvironmentVariable('MONGO_URL');

// get the value of --deps flag
export const getDeps = () => getArg('deps');

// construct the apt-get deps lines for the Dockerfile
export const getDependencyInstallScripts = (deps = getDeps('deps')) => {
  if (!deps) {
    return '';
  }
  const delimiter = deps.includes(',') ? ',' : ' ';
  return deps
    .split(delimiter)
    .reduce(
      (accumulator, currentValue) => `${accumulator}RUN apt-get install ${currentValue}\n`,
      '',
    );
};

const getHealthcheckPath = () => getEnvironmentVariable('HEALTHCHECK_PATH') || '/';

const getHealthcheckTimeout = () => getEnvironmentVariable('HEALTHCHECK_TIMEOUT') || 5000;

// the call timeout of the healthcheck has to be longer than the actual timeout
const getHealthcheckCallTimeout = () => `${Math.parseInt(getHealthcheckTimeout() / 1000 + 5)}s`;

const getHealthcheckInterval = () => getEnvironmentVariable('HEALTHCHECK_INTERVAL') || '20s';

const getHealthcheckRetries = () => getEnvironmentVariable('HEALTHCHECK_RETRIES') || '3';

// construct the healthceck contents
const getHealthcheckFileContents = () => {
  const path = getHealthcheckPath();
  const timeout = getHealthcheckTimeout();
  
  return `const http = require('http');

const options = {  
  host: 'localhost',
  port: 3000,
  path: ${path},
  timeout : ${timeout}
};

const request = http.request(options, res => {  
  res.statusCode == 200 ? process.exit(0) : process.exit(1);
});

request.on('error', err => {  
  process.exit(1);
});

request.end();`;
};

// construct the Dockerfile contents
export const getDockerfileContents = async () => {
  // check if user pass any --deps to install in the image
  const deps = getDeps();
  // get approriate docker image vesion
  const dockerImage = getDockerImage();
  // check to see if mogno should be included
  const includeMongo = shouldIncludeMongo();
  return `FROM ${dockerImage}
${deps ? getDependencyInstallScripts(deps) : ''}
${includeMongo
    ? `RUN apt-get update
RUN apt-get install -y mongodb
RUN apt-get install -y supervisor
VOLUME ["/data/db"]`
    : ''}
LABEL name="${projectName}"
COPY . /usr/src/app/
WORKDIR /usr/src/app
${!getArg('nosplit') ? 'RUN cat *sf-part* > bundle.tar.gz' : ''}
RUN tar -xzf bundle.tar.gz
WORKDIR bundle/programs/server
RUN npm install
WORKDIR ../../
${includeMongo ? 'COPY supervisord.conf /etc/supervisor/supervisord.conf' : ''}
EXPOSE 3000
${includeMongo ? 'CMD ["supervisord"]' : 'CMD ["node", "main.js"]'}
HEALTHCHECK \
  --interval=${getHealthcheckInterval} \
  --timeout=${getEnvironmentVariable('HEALTHCHECK_TIMEOUT') || '10s'} \
  --retries=${getHealthcheckRetries} \
  CMD node healthcheck.js`;
};

// construct the supervisord contents
export const getSupervisordFileContents = () => `[supervisord]
nodaemon=true
loglevel=debug
[program:mongo]
command=mongod
[program:node]
command=node "/usr/src/app/bundle/main.js"`;

// prepares all docker related files
export const prepareDockerConfig = async () => {
  try {
    logger.info('Preparing build');
    const dockerfileContents = await getDockerfileContents();
    await writeFile(`${meteorNowBuildPath}/Dockerfile`, dockerfileContents);

    // if user did not pass MONGO_URL
    if (shouldIncludeMongo()) {
      logger.warn(
        'WARNING: Did not pass a MONGO_URL. Bundling a NON-PRODUCTION version of MongoDB with your application. Read about the limitations here: https://git.io/vM72E',
      );
      logger.warn('WARNING: It might take a few minutes for the app to connect to the bundled MongoDB instance after the deployment has completed.');
      logger.debug('creating supervisord.conf');
      // create a supervisord.conf file to run mongodb inside the container
      await writeFile(`${meteorNowBuildPath}/supervisord.conf`, getSupervisordFileContents());
    }
    await writeFile(`${meteorNowBuildPath}/healthcheck.js`, getHealthcheckFileContents());
    logger.succeed();
  } catch (e) {
    // eslint-disable-next-line
    logger.error(e);
  }
};
