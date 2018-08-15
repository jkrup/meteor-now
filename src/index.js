import { buildMeteorApp } from './api/meteor';
import { prepareDockerConfig } from './api/docker';
import { clearBuildFolder, prepareBundle } from './api/files';
import { deploy, alias } from './api/now';

const main = async () => {
  await clearBuildFolder();
  await buildMeteorApp();
  await prepareDockerConfig();
  await prepareBundle();
  const deploymentUrl = await deploy();
  alias(deploymentUrl);
};

main();
