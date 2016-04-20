const knexfile = require('../db/knexfile')
const knex = require('knex')(knexfile)
const bookshelf = require('bookshelf')(knex)
let ModelBase = require('bookshelf-modelbase')(bookshelf)
if (process.env.NODE_ENV === 'test') {
  ModelBase = ModelBase.extend({}, {
    _knex: bookshelf.knex
  })
}
module.exports = ModelBase
