const TABLE = 'users'

exports.up = function(knex) {
  return knex.schema.table(TABLE, t => {
    t.dropColumn('transit_bookmarks_text')
  })
}

exports.down = function(knex) {
  return knex.schema.table(TABLE, t => {
    t.text('transit_bookmarks_text').defaultTo('[]').comment(`The user''s transit bookmarks serialized as JSON text`)
  })
}
