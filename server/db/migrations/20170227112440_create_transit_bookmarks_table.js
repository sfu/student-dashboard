const table = 'transit_bookmarks';

exports.up = (knex) => {
  return knex.schema.createTable(table, (t) => {
    t.comment('Transit Bookmarks');
    t.increments().primary();
    t.integer('user_id')
      .notNull()
      .references('id')
      .inTable('users')
      .comment('The user to whom the bookmark belongs');
    t.text('stop').notNull().comment('The Translink stop number');
    t.text('route').notNull().comment('The Translink route of the bus');
    t.text('destination')
      .notNull()
      .comment('The Translink destination of the bus');
    t.unique(['user_id', 'stop', 'route', 'destination']);
  });
};

exports.down = (knex) => knex.schema.dropTable(table);
