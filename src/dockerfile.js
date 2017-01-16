import fs from 'fs';

class Dockerfile {
  constructor() {
    // Set node to correct version based on meteor version (1.4+ vs 1.3-)
    const data = fs.readFileSync('.meteor/versions', {
      encoding: 'utf8'
    });
    const version = data.match(/\nmeteor@(.*)\n/)[1];
    const microVersion = version.split('.')[1];
    this.dockerImage = (parseInt(microVersion, 10) < 4)
      ? 'nodesource/jessie:0.10.43'
      : 'node:boron';

    // Determine bundle name (it's based on meteor directory)
    const pwd = process.env.PWD;
    const builddir = pwd.split('/')[pwd.split('/').length - 1];
    this.buildzip = `${builddir}.tar.gz`;
  }

  getContents = () => {
    return `
      FROM ${this.dockerImage}
      ADD ${this.buildzip} .
      WORKDIR bundle/programs/server
      RUN npm install
      WORKDIR ../../
      EXPOSE 80
      CMD ["node", "main.js"]
    `;
  }
}

export let dockerfile = new Dockerfile();
