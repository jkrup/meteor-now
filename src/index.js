import { buildMeteorApp } from './api/meteor';
import { prepareDockerConfig } from './api/docker';
import { clearBuildFolder, prepareBundle } from './api/files';
import { alias, deploy, prepareNowJson } from './api/now';

const main = async () => {
  await clearBuildFolder();
  await buildMeteorApp();
  await prepareDockerConfig();
  await prepareBundle();
  await prepareNowJson();
  await deploy();
  const deploymentUrl = await deploy();
  alias(deploymentUrl);
};

main();
