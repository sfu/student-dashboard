const { readFile } = require('fs');

module.exports = (filename, app) => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      // if in production, read the file from disk
      readFile(`${app.get('htmlDirectory')}/${filename}`, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    } else {
      // in in development, read the file from memory-fs
      const compiler = app.get('compiler');
      compiler.outputFileSystem.readFile(
        `${compiler.outputPath}/${filename}`,
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(content);
          }
        }
      );
    }
  });
};
