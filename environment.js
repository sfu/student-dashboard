// environment.js
// This file loads a .env.${NODE_ENV} file from the same directory as this file
// If NODE_ENV === undefined, assume development
// Use in require hooks -- see the `start` and `test` scripts in package.json

const resolve = require('path').resolve;
const NODE_ENV = process.env.NODE_ENV || 'development';
const path = resolve(__dirname, `.env.${NODE_ENV}`);
const dotenv = require('dotenv').load({ silent: true, path }); // eslint-disable-line no-unused-vars
