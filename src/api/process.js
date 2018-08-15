import { spawn } from 'child_process';
import { isDebug } from './args';
import logger from './logger';

export default (cmd, args) => {
  if (isDebug()) {
    logger.debug(`$ ${cmd}`, ...args);
  }

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: isDebug() ? 'inherit' : [process.stdin, 'pipe', process.stderr],
      shell: true,
    });
    let processData = '';

    child.on('exit', (code, signal) => {
      if (code !== 0) {
        reject({ code, signal });
      } else {
        resolve(processData);
      }
    });

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        processData = data.toString();
      });
    }
  });
};
