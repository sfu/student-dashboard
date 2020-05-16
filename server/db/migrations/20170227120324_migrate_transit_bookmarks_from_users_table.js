exports.up = (knex, Promise) => {
  return knex
    .select(['id', 'transit_bookmarks_text'])
    .from('users')
    .where('transit_bookmarks_text', '<>', '[]')
    .then((records) => {
      const promises = records
        .map((r) => {
          const { id } = r;
          const bookmarks = JSON.parse(r.transit_bookmarks_text);
          return bookmarks.map((b) => {
            return knex
              .insert({
                user_id: id,
                stop: b.stop,
                route: b.route,
                destination: b.destination,
              })
              .into('transit_bookmarks');
          });
        })
        .reduce((a, b) => a.concat(b), []);
      return Promise.all(promises);
    });
};

exports.down = (knex) => knex.raw('DELETE FROM transit_bookmarks;');
