export default (msg, ...rest) => {
  const [options] = rest;
  console.log(`[METEOR-NOW] - ${msg}`, options ? options.join(' ') : '');
};
