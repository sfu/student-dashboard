exports.up = (knex) => {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION uppercase_destination() RETURNS trigger AS $uppercase_destination_on_insert$
        BEGIN
            NEW.destination = UPPER(NEW.destination);
            RETURN NEW;
        END;
    $uppercase_destination_on_insert$ LANGUAGE plpgsql;
  `);
};

exports.down = (knex) =>
  knex.raw('DROP FUNCTION IF EXISTS uppercase_destination()');
