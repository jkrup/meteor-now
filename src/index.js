import { buildMeteorApp } from './api/meteor';
import { prepareDockerConfig } from './api/docker';
import { clearBuildFolder, splitBuild } from './api/files';
import { deploy } from './api/now';

const main = async () => {
  try {
    await clearBuildFolder();
    await buildMeteorApp();
    await prepareDockerConfig();
    await splitBuild();
    await deploy();
  } catch (e) {
    console.error(e);
  }
};

main();
