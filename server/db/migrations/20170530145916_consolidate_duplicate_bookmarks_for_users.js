const SELECT_DUPLICATE_USERNAMES = `SELECT username FROM (
SELECT username, COUNT(username) AS username_count FROM users GROUP BY username
) AS duplicate_users WHERE username_count > 1
ORDER BY username_count DESC;`

exports.up = function(knex) {
  return knex.raw(SELECT_DUPLICATE_USERNAMES).then(values => {
    const usernames = values.rows.map(r => r.username)
    const promises = usernames.map(u => {
      const query = `delete from transit_bookmarks where id in (
                      select id from (select id, user_id, hash, row_number() over
                      (partition by hash order by id) as rnum
                      from transit_bookmarks
                      where user_id in (select id from users where username = '${u}')
                      order by hash, user_id
                      ) t
                      where t.rnum > 1);
      `
      return knex.raw(query)
    })
    return Promise.all(promises)
  })
}

exports.down = () => {}
