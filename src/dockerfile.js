import fs from 'fs';
import { getDependencies } from './utils';

const isWin = /^win/.test(process.platform);

class Dockerfile {
  constructor() {
    // Set node to correct version based on meteor version (1.4+ vs 1.3-)
    const data = fs.readFileSync('.meteor/release', {
      encoding: 'utf8',
    });
    const version = data.match(/METEOR@(.*)\r?\n/)[1];
    const microVersion = version.split('.')[1];

    this.dependencies = getDependencies();
    this.dockerImage = (parseInt(microVersion, 10) < 4)
      ? 'nodesource/jessie:0.10.43'
      : 'node:boron';

    this.serverOnly = (parseInt(microVersion, 10) < 3)
      ? ''
      : '--server-only';

    // Determine bundle name (it's based on meteor directory)
    const cwd = process.cwd();
    if (isWin) {
      this.builddir = cwd.split('\\')[cwd.split('\\').length - 1];
    } else {
      this.builddir = cwd.split('/')[cwd.split('/').length - 1];
    }
    this.buildzip = `${this.builddir}.tar.gz`;
  }

  getDependencyInstallScripts() {
    if (!this.dependencies) {
      return '';
    }
    return this.dependencies.reduce((accumulator, currentValue) =>
      `${accumulator}RUN apt-get install ${currentValue}\n`,
      '');
  }

  getContents(includedMongoDB) {
    const dependencies = this.getDependencyInstallScripts();
    if (includedMongoDB) {
      return `
FROM ${this.dockerImage}
${dependencies}
ENV NPM_CONFIG_LOGLEVEL warn
LABEL name="${this.builddir}"
COPY . .
RUN cat *sf-part* > bundle.tar.gz
RUN tar -xzf bundle.tar.gz
WORKDIR bundle/programs/server
RUN npm install
WORKDIR ../../
EXPOSE 3000
CMD ["node", "main.js"]
    `;
    }
    return `
FROM ${this.dockerImage}
${dependencies}
RUN apt-get update
RUN apt-get install -y mongodb
RUN apt-get install -y supervisor

VOLUME ["/data/db"]

ENV NPM_CONFIG_LOGLEVEL warn
LABEL name="${this.builddir}"
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN cat *sf-part* > bundle.tar.gz
RUN tar -xzf bundle.tar.gz
WORKDIR bundle/programs/server
RUN npm install
WORKDIR ../../

COPY supervisord.conf /etc/supervisor/supervisord.conf

EXPOSE 3000
CMD ["supervisord"]
`;
  }
  getSupervisor() { // eslint-disable-line class-methods-use-this
    return `
[supervisord]
nodaemon=true
loglevel=debug

[program:mongo]
command=mongod

[program:node]
command=node "/usr/src/app/bundle/main.js"
    `;
  }
}

export const dockerfile = new Dockerfile();
export default Dockerfile;
