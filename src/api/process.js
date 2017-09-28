import { spawn } from 'child_process';
import logger from './logger';

export default (cmd, args) => {
  logger(`$ ${cmd}`, args);
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve({ code, signal });
      } else {
        reject({ code, signal });
      }
    });
  });
};
