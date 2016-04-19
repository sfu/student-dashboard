const path = require('path')

if (!(process.env.PG_HOST || process.env.PG_USER || process.env.PG_PASS || process.env.PG_DATABASE)) {
  throw new Error('Required DB options not set in .env')
}

module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DATABASE
  },
  migrations: {
    directory: path.resolve(__dirname, './migrations'),
    tableName: 'schema_migrations'
  }
}
