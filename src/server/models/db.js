const knexfile = require('../db/knexfile')
const knex = require('knex')(knexfile)
const bookshelf = require('bookshelf')(knex)
let Model = bookshelf.Model

if (process.env.NODE_ENV === 'test') {
  module.exports =  Model.extend({}, {
    _knex: bookshelf.knex
  })
} else {
  module.exports = bookshelf
}
