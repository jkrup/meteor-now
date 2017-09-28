import { includes } from 'lodash';
import { writeFile } from './files';
import logger from './logger';
import { meteorNowBuildPath, projectName } from './constants';
import { getMicroVersion } from './meteor';
import { getEnvironmentVariable, getArg } from './args';

export const prepareDockerConfig = async () => {
  logger('creating docker config');
  const dockerfileContents = await getDockerfileContents();
  await writeFile(`${meteorNowBuildPath}/Dockerfile`, dockerfileContents);
  if (shouldIncludeMongo()) {
    logger('creating supervisord.conf');
    await writeFile(
      `${meteorNowBuildPath}/supervisord.conf`,
      getSupervisordFileContents(),
    );
  }
};

export const getDockerfileContents = async () => {
  const deps = getDeps();
  const dockerImage = getDockerImage();
  const includeMongo = shouldIncludeMongo();
  return `FROM ${dockerImage}
${!!deps ? getDependencyInstallScripts(deps) : ''}
${includeMongo
    ? `RUN apt-get update
RUN apt-get install -y mongodb
RUN apt-get install -y supervisor
VOLUME ["/data/db"]`
    : ''}
LABEL name="${projectName}"
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN cat *sf-part* > bundle.tar.gz
RUN tar -xzf bundle.tar.gz
WORKDIR bundle/programs/server
RUN npm install
WORKDIR ../../
${includeMongo ? 'COPY supervisord.conf /etc/supervisor/supervisord.conf' : ''}
EXPOSE 3000
${includeMongo ? 'CMD ["supervisord"]' : 'CMD ["node", "main.js"]'}`;
};

export const getDockerImage = () =>
  parseInt(getMicroVersion(), 10) < 4
    ? 'nodesource/jessie:0.10.43'
    : 'node:boron';

export const shouldIncludeMongo = () => !getEnvironmentVariable('MONGO_URL');

export const getDeps = () => getArg('deps');

export const getDependencyInstallScripts = deps => {
  if (!deps) {
    return '';
  }
  const delimiter = deps.includes(',') ? ',' : ' ';
  return deps
    .split(delimiter)
    .reduce(
      (accumulator, currentValue) =>
        `${accumulator}RUN apt-get install ${currentValue}\n`,
      '',
    );
};

export const getSupervisordFileContents = () => `[supervisord]
nodaemon=true
loglevel=debug
[program:mongo]
command=mongod
[program:node]
command=node "/usr/src/app/bundle/main.js"`;
