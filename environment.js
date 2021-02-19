// environment.js
// This file loads a .env.${NODE_ENV} file from the same directory as this file
// If NODE_ENV === undefined, assume development
// Use in require hooks -- see the `start` and `test` scripts in package.json

const resolve = require('path').resolve;
const NODE_ENV = process.env.NODE_ENV || 'development';
const dotenv = require('dotenv').config();
