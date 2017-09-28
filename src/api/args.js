import { argv } from 'yargs';

// returns the arg based on name
export const getArg = argName => argv[argName];

// returns list of environment variables (-e flag)
// as an array of env objects [{ name: 'MONGO_URL', value: 'mongodb...' }]
export const getEnvironmentVariables = () => {
  const args = getArg('e');
  if (!args) return null;
  const argsArray = args instanceof Array ? args : [args];
  return argsArray.map(e => {
    const envArray = e.split('=');
    return {
      name: envArray[0],
      value: envArray[1],
    };
  });
};

// return a single env object
export const getEnvironmentVariable = (
  name,
  args = getEnvironmentVariables(),
) => {
  if (!args) {
    return null;
  }
  const variable = args.find(e => e.name === name);
  return variable ? variable.value : null;
};
