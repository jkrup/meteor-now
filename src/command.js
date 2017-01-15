import Spawner from 'promise-spawner';
import logger from './logger';

export default class Command {
  constructor() {
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
  run = (cmd) => {
    logger(`running command: ${cmd}`)
    return this.spawner.spawn(cmd);
  }
}
