import { writeFile } from './files';
import logger from './logger';
import { meteorNowBuildPath, projectName } from './constants';
import { getMicroVersion } from './meteor';
import { getEnvironmentVariable, getArg } from './args';

// get docker image version
export const getDockerImage = async () => {
  const dockerImage = getArg('docker-image');
  if (dockerImage) {
    return dockerImage;
  }
  const version = await getMicroVersion();
  if (version < 4) {
    return 'nodesource/jessie:0.10.43';
  } else if (version < 7) {
    return 'node:8.9.4';
  }
  return 'node:8.11.2';
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

// construct the Dockerfile contents
export const getDockerfileContents = async () => {
  // check if user pass any --deps to install in the image
  const deps = getDeps();
  // get approriate docker image vesion
  const dockerImage = await getDockerImage();
  // check to see if mogno should be included
  const includeMongo = shouldIncludeMongo();
  return `FROM ${dockerImage}
${deps ? getDependencyInstallScripts(deps) : ''}
${includeMongo
    ? `RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN apt-get install -y supervisor
VOLUME ["/data/db"]`
    : ''}
LABEL name="${projectName}"
COPY bundle/programs/server/package.json /usr/src/app/bundle/programs/server/package.json
WORKDIR /usr/src/app/bundle/programs/server
RUN npm install
WORKDIR ../../..
COPY . .
${!getArg('nosplit') ? 'RUN cat *sf-part* > bundle.tar.gz' : ''}
RUN tar -xzf bundle.tar.gz
${includeMongo ? 'COPY supervisord.conf /etc/supervisor/supervisord.conf' : ''}
WORKDIR bundle
EXPOSE 3000
${includeMongo ? 'CMD ["supervisord"]' : 'CMD ["node", "main.js"]'}`;
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
    logger.succeed();
  } catch (e) {
    // eslint-disable-next-line
    logger.error(e);
  }
};
