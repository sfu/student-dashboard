const sql =
`CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
`

exports.up = (knex) => {
  knex.schema.raw(sql)
}

exports.down = (knex) => {
  knex.schema.raw('DROP FUNCTION IF EXISTS update_updated_at_column()')
}
