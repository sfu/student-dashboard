const DELETE_DUPS_NO_BOOKMARKS = `DELETE FROM users
WHERE id IN (SELECT id
            FROM (SELECT id,
                           ROW_NUMBER() OVER (partition BY username ORDER BY id) AS rnum
                   FROM users) t
            WHERE t.rnum > 1);
`;

exports.up = function (knex) {
  return knex.raw(DELETE_DUPS_NO_BOOKMARKS);
};

exports.down = function () {};
