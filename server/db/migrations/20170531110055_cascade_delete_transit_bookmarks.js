const TABLE = 'transit_bookmarks'
const FOREIGN = 'user_id'

exports.up = function(knex) {
  return knex.schema.table(TABLE, t => {
    t.dropForeign(FOREIGN)
    t.foreign(FOREIGN).references('id').inTable('users').onDelete('CASCADE')
  })
}

exports.down = function() {}
