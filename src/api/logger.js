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
    let restOfMessage;
    if (rest.length === 0) {
      restOfMessage = null;
    } else if (typeof rest[0] !== 'string') {
      restOfMessage = JSON.stringify(rest, null, 4);
    } else {
      restOfMessage = rest.join(' ');
    }
    const prefixed = `${logPrefix}${message} ${!restOfMessage
      ? ''
      : restOfMessage}`;
    if (type === 'succeed') {
      spinner.succeed();
    } else {
      spinner[type](prefixed);
    }
  }
}
