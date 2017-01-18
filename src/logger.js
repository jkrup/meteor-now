export default (msg, isVerbose = false) => {
  if (isVerbose) {
    console.log(`[METEOR-NOW] - ${msg}`); // eslint-disable-line no-console
  }
};
