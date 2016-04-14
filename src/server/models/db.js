const knexfile = require('../db/knexfile')
const knex = require('knex')(knexfile)
const bookshelf = require('bookshelf')(knex)
const ModelBase = require('bookshelf-modelbase')(bookshelf)
module.exports = ModelBase
