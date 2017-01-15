#!/usr/bin/env node

var fs = require('fs');

var spawn = require('child_process').spawn;

var cmd1    = spawn('meteor', ['build', '.meteor/local/builds']);

var exec = require('child_process').exec;

var cmd = 'cd .meteor/local/builds;';

var cmd2 = 'now -e ROOT_URL=http://example.com -e ';

var builddir = 'drp'; //TODO:
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


cmd1.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
});

cmd1.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
});

cmd1.on('close', function (code) {
    console.log('child process exited with code ' + code.toString());
    exec(cmd, function(error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
            // return;
        }
        console.log(stdout);
        fs.writeFile('Dockerfile', dockerfile, (err) => {
            if (err) {
                throw err;
            }
            console.log('It\'s saved!');
            exec(cmd2, function(error, stdout, stderr) {
                if (stderr) {
                    console.log(stderr);
                    // return
                }
                console.log(stdout);
            });
        });
    });
});





var buildzip = 'drp.tar.gz';
// save dockerfile --> Dockerfile

// now -e
//
