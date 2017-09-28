import os from 'os';

export const projectName = (() => {
  const cwd = process.cwd();
  const isWin = /^win/.test(process.platform);
  if (isWin) {
    return cwd.split('\\')[cwd.split('\\').length - 1];
  }
  return cwd.split('/')[cwd.split('/').length - 1];
})();
export const homePath = os.homedir();
export const meteorNowBuildPath = `${homePath}/.meteor-now/build`;
export const tarFileName = `${projectName}.tar.gz`;
export const ignoreVarsArray = ['MONGO_URL', 'ROOT_URL', 'METEOR_SETTINGS', 'PORT'];
export const ignoreOptionsArray = ['deps', '_', '$0', 'help', 'version'];
