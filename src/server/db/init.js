/* eslint no-console: 0 */

const cloneDeep = require('lodash').cloneDeep
const path = require('path')
const chalk = require('chalk')

;(async function() {

  const DROP_DB = `DROP DATABASE IF EXISTS ${process.env.PG_DATABASE};`
  const CREATE_DB = `CREATE DATABASE ${process.env.PG_DATABASE};`

  const migrationConfig = require('./knexfile')
  const initConfig = cloneDeep(migrationConfig)
  initConfig.connection.database = process.env.PG_DEFAULT_DB || 'postgres'

  const initKnex = require('knex')(initConfig)
  let migrationKnex = null
  let code = 0

  const {host, user, database} = migrationConfig.connection

  process.stdout.write('\n')
  console.log(`${chalk.yellow.bold('Host:')} ${host}`)
  console.log(`${chalk.yellow.bold('User:')} ${user}`)
  console.log(`${chalk.yellow.bold('Database:')} ${database}`)
  process.stdout.write('\n')
  try {

    process.stdout.write(chalk.cyan(`Attempting to drop DB ${process.env.PG_DATABASE}... `))
    await initKnex.raw(DROP_DB)
    process.stdout.write(chalk.green('✓\n'))

    process.stdout.write(chalk.cyan(`Attempting to create DB ${process.env.PG_DATABASE}... `))
    await initKnex.raw(CREATE_DB)
    process.stdout.write(chalk.green('✓\n'))

    process.stdout.write(chalk.cyan(`Attempting to run migrations... `))
    migrationKnex = require('knex')(migrationConfig)
    const migration = await migrationKnex.migrate.latest(migrationConfig)
    process.stdout.write(chalk.green(`✓\n`))
    if (migration[1].length) {
      const list = migration[1].map((m) => `  - ${path.basename(m)}\n`).join('\n')
      process.stdout.write(chalk.magenta(`${list}\n`))
    } else {
      process.stdout.write(chalk.magenta('  - no migrations to run\n'))
    }
  } catch (e) {
    process.stdout.write(chalk.red.bold('¯\\_(FAIL)_/¯\n'))
    console.log(e)
    console.log(e.stack)
    code = 1
  } finally {
    process.exit(code)
  }
})()
