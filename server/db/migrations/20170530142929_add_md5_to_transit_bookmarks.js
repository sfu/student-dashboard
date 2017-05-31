const TABLE = 'transit_bookmarks'

exports.up = function(knex) {
  return knex.schema.table(TABLE, t => {
    t.text('hash')
  }).then(function() {
    return knex.raw(`UPDATE ${TABLE} SET hash = md5(ROW(stop, route, destination)::TEXT)`)
  })
}

exports.down = function() {}
