const knex = require('knex');
const mockKnex = require('mock-knex');
const config = require('./knexfile');

const { NODE_ENV } = process.env;
module.exports =
  NODE_ENV === 'test' ? mockKnex.mock(knex(config)) : knex(config);
