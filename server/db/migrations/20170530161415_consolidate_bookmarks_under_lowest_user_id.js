const SELECT_DUPLICATE_USERNAMES = `SELECT username, username_count, min_id FROM (
SELECT username, COUNT(username) AS username_count, MIN(id) AS min_id FROM users GROUP BY username
) AS duplicate_users WHERE username_count > 1
ORDER BY username_count DESC;`

exports.up = function(knex) {

  return knex.raw(SELECT_DUPLICATE_USERNAMES).then(r => {
    const promises = r.rows.map(user => {
      const user_ids_query = `SELECT id FROM users WHERE username = '${user.username}'`
      const update_query = `
        UPDATE transit_bookmarks SET user_id = ${user.min_id} WHERE user_id IN (${user_ids_query});
      `
      return knex.raw(update_query)
    })
    return Promise.all(promises)
  })

}

exports.down = function() {}
