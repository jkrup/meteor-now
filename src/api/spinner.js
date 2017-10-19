import Ora from 'ora';
import cliSpinners from 'cli-spinners';

class Spinner extends Ora {
  constructor() {
    super();
    this.spinner = cliSpinners.dots12;
  }
}

const spinner = new Spinner();

export default spinner;
