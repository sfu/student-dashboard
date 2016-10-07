const table = 'users'

exports.up = (knex) => {
  return knex.schema.table(table, (t) => {
    t.text('oauth_access_token').comment(`The user''s Oauth Access Token`)
    t.text('oauth_refresh_token').comment(`The user''s Oauth Refresh Token`)
    t.dateTime('oauth_valid_until').comment(`The expiry date of the Oauth Access Token`)
  })
}

exports.down = (knex) => {
  return knex.schema.table(table, (t) => {
    t.dropColumn('oauth_access_token')
    t.dropColumn('oauth_refresh_token')
    t.dropColumn('oauth_valid_until')
  })
}
