const table = 'users'

exports.up = function(knex) {
  return knex.schema.table(table, t => {
    t.text('preferences_text').defaultTo('[]').comment(`The user''s preferences serialized as JSON text`)
  })
}

exports.down = function(knex) {
  return knex.schema.table(table, t => {
    t.dropColumn('preferences_text')
  })
}
