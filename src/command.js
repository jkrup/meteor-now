import Spawner from 'promise-spawner';
import logger from './logger';

export default class Command {
  constructor(command) {
    this.command = command;
    const modifiers = {
      out: function(d) { return d },
      err: 'this is an error: '
    };
    this.spawner = new Spawner(modifiers, {
      stdio: 'inherit'
    });
    this.spawner.out.pipe(process.stdout);
    this.spawner.err.pipe(process.stdout);
  }
  run = () => {
    logger(`running command: ${this.command}`)
    return this.spawner.spawn(this.command);
  }
}
