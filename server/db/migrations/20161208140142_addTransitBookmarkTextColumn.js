const table = 'users'

exports.up = function(knex) {
  return knex.schema.table(table, t => {
    t.text('transit_bookmarks_text').defaultTo('[]').comment(`The user''s transit bookmarks serialized as JSON text`)
  })
}

exports.down = function(knex) {
  return knex.schema.table(table, t => {
    t.dropColumn('transit_bookmarks_text')
  })
}
