import { spawnProcess } from './process';
import { getEnvironmentVariable } from './args';
import { meteorNowBuildPath, projectName } from './constants';

export const deploy = async () => {
  const rootUrl = getEnvironmentVariable('ROOT_URL') || 'http://localhost.com';
  const mongoUrl = getEnvironmentVariable('MONGO_URL') || 'mongodb://127.0.0.1:27017';
  const meteorSettings = getEnvironmentVariable('METEOR_SETTINGS');
  const nowOptions = [
    meteorNowBuildPath,
    ['--name', projectName],
    ['-e', 'PORT=3000'],
    ['-e', `ROOT_URL=${rootUrl}`],
    ['-e', `MONGO_URL=${mongoUrl}`],
    meteorSettings && ['-e', `METEOR_SETTINGS='${meteorSettings}'`],
  ];
  await spawnProcess('now', [].concat.apply([], nowOptions));
  // await spawnProcess(`now ${meteorNowBuildPath} --name ${projectName}`)
  // const message = 'deploying build';
  // let mongoUrl = '';
  // if (!didPassParam('MONGO_URL')) {
  //   console.log(colors.yellow('WARNING: Did not pass a MONGO_URL. Bundling a NON-PRODUCTION version of MongoDB with your application. Read about the limitations here: https://git.io/vM72E')); // eslint-disable-line no-console
  //   mongoUrl = '-e MONGO_URL=mongodb://127.0.0.1:27017';
  // }
  // spinner.start(`${message} (this can take several minutes)`);
  // const args = process.argv.slice(2).join(' ');
  // const meteorSettingsArg = meteorSettingsVar ? `-e METEOR_SETTINGS='${meteorSettingsVar}'` : '';
  // const rootUrl = !didPassParam('ROOT_URL') ? '-e ROOT_URL=http://localhost.com' : '';
  // const deployCommand = new Command(`cd .meteor/local/builds && now -e PORT=3000 ${mongoUrl} ${rootUrl} ${args} ${meteorSettingsArg}`);
  // await deployCommand.run();
  // spinner.succeed(message);
};
