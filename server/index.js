/* eslint no-console: 0 */
const { createServer } = require('./server');
const express = require('express');
const assert = require('assert');
const { extendExpress } = require('./extendExpress');

extendExpress();

if (process.env.NODE_ENV === 'production') {
  assert(
    process.env.JWT_MODE !== 'decode',
    `Don't use JWT_MODE=decode in production!`
  );
}

const app = express();
app.set('trust proxy', 1);

createServer(app).listen(process.env.EXPRESS_PORT, () => {
  console.info(`HTTP server listening on port ${process.env.EXPRESS_PORT}`);
});
