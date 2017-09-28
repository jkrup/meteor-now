import { argv } from 'yargs';

export const getArg = argName => argv[argName];

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
