exports.up = (knex) => {
  return knex.schema.createTable('users', (t) => {
    t.comment('A SFU User')
    t.increments().primary()
    t.text('username').notNull().comment(`The user''s unique SFU Computing ID`)
    t.text('lastname').notNull().comment(`The user''s last name, as defined in Amaint`)
    t.text('firstnames').notNull().comment(`The user''s legal given names, as defined in Amaint`)
    t.text('commonname').nullable().comment(`The user''s ''preferred'' name, as defined in Amaint`)
    t.text('barcode').nullable().comment(`The user''s SFU Library barcode number`)
    t.text('access_token').nullable().comment(`The user''s oAuth access token`)
    t.text('refresh_token').nullable().comment(`The user''s oAuth refresh token`)
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('users')
}
