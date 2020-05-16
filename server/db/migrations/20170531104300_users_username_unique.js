const table = 'users';

exports.up = function (knex) {
  return knex.schema.alterTable(table, (t) => {
    t.unique('username');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(table, (t) => {
    t.dropUnique('username');
  });
};
