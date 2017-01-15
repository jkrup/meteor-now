var builddir = 'dirty-mine'; //TODO:
var buildzip = builddir + '.tar.gz';

export default class Dockerfile {
  constructor() {
    this.dockerImage = 'nodesource/jessie:0.10.43';
  }
  getContents = () => {
    return `
      FROM ${this.dockerImage}
      ADD ${buildzip} .
      WORKDIR "bundle/programs/server"
      RUN npm install
      WORKDIR "../../"
      EXPOSE 80
      CMD ["node", "main.js"]
    `;
  }
}
