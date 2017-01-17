import fs from 'fs';

const isStringJson = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

const readFile = async (path) => {
  return new Promise((resolve, reject) => {
    const data = fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject('no meteor settings file found');
      } else {
        resolve(data);
      }
    });
  });
};

export {
  isStringJson,
  readFile,
}
