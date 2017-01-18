import ora from 'ora';

class Spinner {
  constructor() {
    this.spinner = ora();
  }
  start(message = null) {
    if (message) {
      this.setMessage(message);
    }
    this.spinner.start();
  }
  stop = () => this.spinner.stop();
  stopAndPersist = () => this.spinner.stopAndPersist();
  succeed = () => this.spinner.succeed();
  fail = () => this.spinner.fail();
  setMessage = (message) => this.spinner.text = message;
}

export const spinner = new Spinner();
