exports.up = (knex) => {
  return knex.raw(`
    CREATE TRIGGER uppercase_destination_on_insert
    BEFORE INSERT OR UPDATE ON transit_bookmarks
    FOR EACH ROW EXECUTE PROCEDURE uppercase_destination();
  `);
};

exports.down = (knex) =>
  knex.raw(
    'DROP TRIGGER IF EXISTS uppercase_destination_on_insert ON transit_bookmarks;'
  );
