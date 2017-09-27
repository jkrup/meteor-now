import os from 'os';

export const projectName = (() => {
  const cwd = process.cwd();
  const isWin = /^win/.test(process.platform);
  if (isWin) {
    return cwd.split('\\')[cwd.split('\\').length - 1];
  } else {
    return cwd.split('/')[cwd.split('/').length - 1];
  }
})();
export const homePath = os.homedir();
export const meteorNowBuildPath = `${homePath}/.meteor-now/build`;
export const tarFileName = `${projectName}.tar.gz`;
