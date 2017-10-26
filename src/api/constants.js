import os from 'os';

export const getFolderName = (path, isWin = /^win/.test(process.platform)) => {
  const pathDelimiter = isWin ? '\\' : '/';
  const pathParts = path.split(pathDelimiter);
  return pathParts[pathParts.length - 1];
};

// run immediately
export const projectName = (() => getFolderName(process.cwd()))();
export const homePath = os.homedir();
export const meteorNowBuildPath = `${homePath}/.meteor-now/build`;
export const tarFileName = `${projectName}.tar.gz`;
export const ignoreVarsArray = ['MONGO_URL', 'ROOT_URL', 'METEOR_SETTINGS', 'PORT'];
export const ignoreOptionsArray = ['deps', '_', '$0', 'help', 'version', 'nosplit'];
export const logPrefix = '[METEOR-NOW] - ';
