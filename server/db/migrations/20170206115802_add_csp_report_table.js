const table = 'csp_reports'

exports.up = (knex) => {
  return knex.schema.createTable(table, (t) => {
    t.comment('A Content Security Policy Violation Report')
    t.increments().primary()
    t.text('report').notNull().comment(`The CSP report (stringifyied JSON)`)
    t.text('request_id').notNull().comment(`The user''s last name, as defined in Amaint`)
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))
  }).raw(`CREATE TRIGGER update_${table}_updated_at BEFORE UPDATE ON ${table} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`)
}

exports.down = (knex) => {
  return knex.schema.dropTable(table)
}
