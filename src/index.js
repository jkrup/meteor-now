import { buildMeteorApp } from './api/meteor';
import { prepareDockerConfig } from './api/docker';
import { clearBuildFolder, splitBuild } from './api/files';
import { deploy } from './api/now';

const main = async () => {
  try {
    // await clearBuildFolder();
    // await buildMeteorApp();
    // await prepareDockerConfig();
    // await splitBuild();
    await deploy();
  } catch (e) {
    // eslint-disable-next-line
    if (e.signal) console.error(e.signal);
    if (e.code) process.exit(e.code);
    // eslint-disable-next-line
    console.error(e);
    process.exit(1);
  }
};

main();
