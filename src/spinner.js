import ora from 'ora';
import { isDebug } from './utils';

const prefix = '[METEOR-NOW]';

class Spinner {
  constructor() {
    this.spinner = ora();
  }
  start(message = null) {
    if (!isDebug()) {
      if (message) { this.setMessage(message); }
      this.spinner.start();
    }
  }
  stop() {
    if (!isDebug()) { this.spinner.stop(); }
  }
  stopAndPersist() {
    if (!isDebug()) { this.spinner.stopAndPersist(); }
  }
  succeed() {
    if (!isDebug()) { this.spinner.succeed(); }
  }
  fail() {
    if (!isDebug()) { this.spinner.fail(); }
  }
  setMessage(message) { this.spinner.text = `${prefix} - ${message}`; }
}

const spinner = new Spinner();

export default spinner;
