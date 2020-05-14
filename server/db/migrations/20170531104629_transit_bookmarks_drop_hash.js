exports.up = function (knex) {
  return knex.schema.table('transit_bookmarks', (t) => {
    t.dropColumn('hash');
  });
};

exports.down = function () {};
