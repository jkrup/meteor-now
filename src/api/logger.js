export default (msg, ...rest) => {
  const [options] = rest;
  // eslint-disable-next-line
  console.log(`[METEOR-NOW] - ${msg}`, options ? options.join(' ') : '');
};
