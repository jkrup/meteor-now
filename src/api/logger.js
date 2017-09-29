import colors from 'colors';
import { logPrefix } from './constants';
import { isDebug } from './args';
import spinner from './spinner';

export default class Logger {
  static info(message, ...rest) {
    if (!isDebug()) {
      this.log('start', message, rest);
    } else {
      this.debug(message);
    }
  }
  static debug(message, ...rest) {
    if (isDebug()) {
      this.log('info', message, rest);
    }
  }
  static warn(message, ...rest) {
    this.log('warn', colors.yellow(message), rest);
  }
  static error(message, ...rest) {
    this.log('fail', colors.red(message), rest);
  }
  static succeed(message, ...rest) {
    if (!isDebug()) {
      this.log('succeed', message, rest);
    }
  }
  static log(type, message, rest) {
    const restOfMessage = [...rest][0] && rest.join(' ');
    const prefixed = `${logPrefix}${message} ${!restOfMessage ? '' : restOfMessage}`;
    if (type === 'succeed') {
      spinner.succeed();
    } else {
      spinner[type](prefixed);
    }
  }
}
