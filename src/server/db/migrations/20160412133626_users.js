exports.up = (knex) => {
  return knex.schema.createTable('users', (t) => {
    t.increments().primary()
    t.text('username').notNull()
    t.text('uuid').nullable()
    t.text('lastname').notNull()
    t.text('firstnames').notNull()
    t.text('commonname').nullable()
    t.text('barcode').nullable()
    t.text('access_token').nullable()
    t.text('refresh_token').nullable()
    t.dateTime('created_at').notNull()
    t.dateTime('updated_at').notNull()
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('users')
}
