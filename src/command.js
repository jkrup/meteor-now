import Spawner from 'promise-spawner';

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
  run = (cmd, msg) => {
    if (msg) { console.log('[METEOR-NOW] -- ' + msg) }
    return this.spawner.spawn(cmd);
  }
}
