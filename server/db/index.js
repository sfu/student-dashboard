import knex from 'knex'
import mockKnex from 'mock-knex'
const config = require('./knexfile')

const { NODE_ENV } = process.env
export default NODE_ENV === 'test' ? mockKnex.mock(knex(config)) : knex(config)
