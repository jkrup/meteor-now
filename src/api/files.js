import fs from 'file-system';
import splitFile from 'split-file';
import del from 'del';
import logger from './logger';
import { meteorNowBuildPath, tarFileName } from './constants';

const encoding = 'utf8';

export const readFile = path => fs.readFileSync(path, encoding);
export const writeFile = (path, data) => fs.writeFileSync(path, data, encoding);

export const deletePath = path => del(path, { force: true });

// split meteor bundle into pieces
export const splitBuild = async () => {
  logger('splitting bundle');
  await splitFile.splitFileBySize(
    `${meteorNowBuildPath}/${tarFileName}`,
    99999,
  );
  await deletePath(`${meteorNowBuildPath}/${tarFileName}`);
};

export const clearBuildFolder = () => {
  logger('clearing build folder');
  return deletePath(meteorNowBuildPath);
};
