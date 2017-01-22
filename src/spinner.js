import ora from 'ora';
import cliSpinners from 'cli-spinners';
import { isDebug } from './utils';

const prefix = '[METEOR-NOW]';

class Spinner {
  constructor() {
    this.spinner = ora({
      spinner: cliSpinners.dots12,
    });
  }
  start(message = null) {
    if (!isDebug()) { this.runAction('start', message); }
  }
  stop(message = null) {
    if (!isDebug()) { this.runAction('stop', message); }
  }
  stopAndPersist(message = null) {
    if (!isDebug()) { this.runAction('stopAndPersist', message); }
  }
  succeed(message = null) {
    if (!isDebug()) { this.runAction('succeed', message); }
  }
  fail(message = null) {
    if (!isDebug()) { this.runAction('fail', message); }
  }
  runAction(action, message) {
    if (message) {
      this.setMessage(message);
    }
    this.spinner[action]();
  }
  setMessage(message) { this.spinner.text = `${prefix} - ${message}`; }
}

const spinner = new Spinner();

export default spinner;
