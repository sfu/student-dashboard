const path = require('path');

if (!process.env.DATABASE_URL) {
  throw new Error('Required DB options not set in .env');
}

module.exports = {
  debug: process.env.KNEX_DEBUG || false,
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.resolve(__dirname, './migrations'),
    tableName: 'schema_migrations',
  },
};
