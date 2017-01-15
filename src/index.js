import Command from './command';
import logger from './logger';

var fs = require('fs');

// var spawn = require('child_process').spawn;

// var cmd1    = spawn('meteor', ['build', '.meteor/local/builds']);
const cmd1 = new Command();

// var exec = require('child_process').exec;

// var cmd = 'cd .meteor/local/builds;';

// var cmd2 = 'now -e ROOT_URL=http://example.com -e ';
const cmd2 = new Command();

var builddir = 'dirty-mine'; //TODO:
var buildzip = builddir + '.tar.gz';

// Meteor 1.3.x and earlier
var dockerfile = `
    FROM nodesource/jessie:0.10.43

    ADD ${buildzip} .

    WORKDIR "bundle/programs/server"

    RUN npm install

    WORKDIR "../../"

    EXPOSE 80

    CMD ["node", "main.js"]
`;

cmd1.run('meteor build .meteor/local/builds', 'building meteor app...')
  .then((out) => {
    logger('done building...');
    fs.writeFile('.meteor/local/builds/Dockerfile', dockerfile, (err) => {
      if (err) {
          throw err;
      }
      logger('created dockerfile...');
      cmd2.run('cd .meteor/local/builds && now -e ROOT_URL=http://example.com', 'deploying using now service...')
        .then((out2) => {
          logger('done deploying...');
        });
    });
  });

var buildzip = 'dirty-mine.tar.gz';
