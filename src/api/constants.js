import os from 'os';

const isWin = /^win/.test(process.platform);

export const getFolderName = (path, isWinOverride = isWin) => {
  const pathDelimiter = isWinOverride ? '\\' : '/';
  const pathParts = path.split(pathDelimiter);
  return pathParts[pathParts.length - 1];
};

// run immediately
export const projectName = (() => getFolderName(process.cwd()))();
export const homePath = os.homedir();
export const meteorNowBuildPath = isWin ? `${homePath}\\.meteor-now\\build` : `${homePath}/.meteor-now/build`;
export const tarFileName = `${projectName}.tar.gz`;
export const ignoreVarsArray = ['MONGO_URL', 'ROOT_URL', 'METEOR_SETTINGS', 'PORT'];
export const ignoreOptionsArray = ['deps', '_', '$0', 'help', 'version', 'nosplit'];
export const logPrefix = '[METEOR-NOW] - ';
