import Spawner from 'promise-spawner';
import logger from './logger';
import { isDebug } from './utils';

export default class Command {
  constructor(command, inheritIo = isDebug()) {
    this.command = command;
    const modifiers = {};

    this.spawner = new Spawner(modifiers, {
      stdio: inheritIo ? 'inherit' : 'pipe',
    });

    if (isDebug()) {
      this.spawner.out.pipe(process.stdout);
      this.spawner.err.pipe(process.stderr);
    }
  }
  run() {
    logger(`running command: ${this.command}`);
    return new Promise((resolve) => {
      this.spawner.spawn(this.command).then(() => {
        resolve(this.data);
      });
    });
  }
}
