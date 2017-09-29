import { spawn } from 'child_process';
import { isDebug } from './args';
import logger from './logger';

export default (cmd, args) => {
  logger.debug(`$ ${cmd}`, ...args);
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: isDebug() ? 'inherit' : [process.stdin, 'pipe', process.stderr],
      shell: true,
    });

    child.on('exit', (code, signal) => {
      if (code !== 0) {
        reject({ code, signal });
      } else {
        resolve();
      }
    });

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        resolve(data.toString());
      });
    }
  });
};
