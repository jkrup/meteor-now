import fs from 'fs';

class Dockerfile {
  constructor() {
    // Set node to correct version based on meteor version (1.4+ vs 1.3-)
    const data = fs.readFileSync('.meteor/release', {
      encoding: 'utf8',
    });
    const version = data.match(/METEOR@(.*)\n/)[1];
    const microVersion = version.split('.')[1];
    this.dockerImage = (parseInt(microVersion, 10) < 4)
      ? 'nodesource/jessie:0.10.43'
      : 'node:boron';

    // Determine bundle name (it's based on meteor directory)
    const pwd = process.env.PWD;
    this.builddir = pwd.split('/')[pwd.split('/').length - 1];
    this.buildzip = `${this.builddir}.tar.gz`;
  }

  getContents(includedMongoDB) {
    if (includedMongoDB) {
      return `
FROM ${this.dockerImage}
ENV NPM_CONFIG_LOGLEVEL warn
LABEL name="${this.builddir}"
COPY . .
RUN cat x* > bundle.tar.gz
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

RUN apt-get update
RUN apt-get install -y mongodb
RUN apt-get install -y supervisor

VOLUME ["/data/db"]

ENV NPM_CONFIG_LOGLEVEL warn
LABEL name="${this.builddir}"
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN cat x* > bundle.tar.gz
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

export const dockerfile = new Dockerfile(); // eslint-disable-line import/prefer-default-export
