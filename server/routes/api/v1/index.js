const { Router } = require('express');
const fs = require('fs');

const router = Router({ mergeParams: true });

// get the list of files in this directory, excluding this file, and strip the extension
const routesFiles = fs
  .readdirSync(__dirname)
  .filter((f) => f !== 'index.js')
  .map((f) => f.replace(/\.[^/.]+$/, ''));

// for each directory in routesFile, mount its index.js file at /${dirname}
// (e.g. users/index.js gets mounted at /users)
routesFiles.forEach((r) => {
  router.use(`/${r}`, require(`./${r}`));
});

module.exports = router;
