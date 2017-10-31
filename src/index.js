import { buildMeteorApp } from './api/meteor';
import { prepareDockerConfig } from './api/docker';
import { clearBuildFolder, prepareBundle } from './api/files';
import { deploy } from './api/now';

const main = async () => {
  await clearBuildFolder();
  await buildMeteorApp();
  await prepareDockerConfig();
  await prepareBundle();
  await deploy();
};

main();
