import Spawner from 'promise-spawner';
import logger from './logger';

export default class Command {
  constructor(command, inheritIo = false) {
    this.command = command;
    const modifiers = {
      out(d) { return d; },
      err: 'this is an error: ',
    };

    this.spawner = new Spawner(modifiers, {
      stdio: inheritIo ? 'inherit' : 'ignore',
    });

    if (inheritIo) {
      this.spawner.out.pipe(process.stdout);
      this.spawner.err.pipe(process.stdout);
    }
  }
  run = () => {
    logger(`running command: ${this.command}`);
    return this.spawner.spawn(this.command);
  }
}
