import fs from 'file-system';
import splitFile from 'split-file';
import del from 'del';
import logger from './logger';
import { meteorNowBuildPath, tarFileName } from './constants';
import { getArg } from './args';

const encoding = 'utf8';

export const readFile = path => fs.readFileSync(path, encoding);
export const writeFile = (path, data) => fs.writeFileSync(path, data, encoding);
export const deletePath = path => del(path, { force: true });
export const renameFile = (oldPath, newPath) => fs.renameSync(oldPath, newPath);

// split meteor bundle into pieces
export const prepareBundle = async () => {
  const bundlePath = `${meteorNowBuildPath}/${tarFileName}`;
  try {
    if (getArg('nosplit')) {
      renameFile(bundlePath, `${meteorNowBuildPath}/bundle.tar.gz`);
    } else {
      logger.debug('splitting bundle');
      await splitFile.splitFileBySize(
        `${meteorNowBuildPath}/${tarFileName}`,
        999999,
      );
      await deletePath(bundlePath);
    }
  } catch (e) {
    logger.error(e);
  }
};

export const clearBuildFolder = () => {
  logger.debug('clearing build folder');
  return deletePath(meteorNowBuildPath);
};
