import yargs from 'yargs';
import { ignoreVarsArray, ignoreOptionsArray } from './constants';

// returns all args as an yargs object
export const getArgs = (argv = process.argv) => yargs(argv).argv;

// returns the arg based on name
export const getArg = (argName, argv = process.argv) => getArgs(argv)[argName];

// returns list of environment variables (-e flag)
// as an array of env objects [{ name: 'MONGO_URL', value: 'mongodb...' }]
export const getEnvironmentVariables = () => {
  const args = getArg('e');
  if (!args) return null;
  const argsArray = args instanceof Array ? args : [args];
  return argsArray.map((e) => {
    const envArray = e.split('=');
    let val = envArray[1];
    if (envArray.length > 2) {
      val = ['"', envArray.slice(1, envArray.length).join('='), '"'].join('');
    }
    return {
      name: envArray[0],
      value: val,
    };
  });
};

// return a single env object
export const getEnvironmentVariable = (name, args = getEnvironmentVariables()) => {
  if (!args) {
    return null;
  }
  const variable = args.find(e => e.name === name);
  return variable ? variable.value : null;
};

// get all variables except for MONGO_URL, ROOT_URL, METEOR_SETTINGS and PORT
// this is in case user passed additional environment variables to their app
// those would be passed down to the now cli command
export const getRemainingVariables = (environmentVariables = getEnvironmentVariables()) => {
  if (!environmentVariables) {
    return [];
  }
  // filter our vars we already handled and return an array
  // where first value is the flag -e and second is the ENV=VALUE
  return environmentVariables
    .filter(v => ignoreVarsArray.indexOf(v.name) === -1)
    .map(v => ['-e', `${v.name}=${v.value}`]);
};

// get remaining options that user has passsed to meteor-now
export const getRemainingOptions = () => {
  const args = getArgs();
  console.log('args are', args); /* eslint-disable no-console */
  return (
    Object.entries(args)
      // filter out specified list of options
      .filter(arg => ignoreOptionsArray.indexOf(arg[0]) === -1)
      // filter out all environment variables
      .filter(arg => arg[0] !== 'e')
      // check if flag is of boolean type and just return flag name
      // yargs sets true if only flag was present without value
      .map((arg) => {
        if (typeof arg[1] === 'boolean') {
          return [arg[0]];
        }
        return [arg[0], arg[1]];
      })
      // prefix flag names with either a single dash (-) or double (--) dash
      .map((arg) => {
        const argWithPrefix = [...arg];
        if (arg[0].length > 1) {
          argWithPrefix[0] = `--${arg[0]}`;
        } else {
          argWithPrefix[0] = `-${arg[0]}`;
        }
        return argWithPrefix;
      })
  );
};

// eslint-disable-next-line
export const flattenOptions = options => [].concat.apply([], options);

// returns true if use passed in -d flag otherwise false
export const isDebug = () => !!getArg('d');
