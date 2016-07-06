const path = require('path')

if (!process.env.DATABASE_URL) {
  throw new Error('Required DB options not set in .env')
}

const config = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.resolve(__dirname, './migrations'),
    tableName: 'schema_migrations'
  }
}

module.exports = config
export default config
