import { isDebug } from './utils';

export default (message) => {
  if (isDebug()) {
    console.log(`[METEOR-NOW] - ${message}`); // eslint-disable-line no-console
  }
};
