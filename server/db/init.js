/* eslint no-console: 0 */

const cloneDeep = require('lodash').cloneDeep;
const path = require('path');
const chalk = require('chalk');
const parse = require('pg-connection-string').parse;

process.on('unhandledRejection', function (reason, p) {
  console.log(
    'Possibly Unhandled Rejection at: Promise ',
    p,
    ' reason: ',
    reason
  );
  // application specific logging here
});
(async function () {
  let code = 0;
  try {
    const PG_CONNECTION = parse(process.env.DATABASE_URL);
    const DROP_DB = `DROP DATABASE IF EXISTS ${PG_CONNECTION.database};`;
    const CREATE_DB = `CREATE DATABASE ${PG_CONNECTION.database};`;

    const migrationConfig = require('./knexfile');
    const initConfig = cloneDeep(migrationConfig);
    initConfig.connection = cloneDeep(PG_CONNECTION);
    initConfig.connection.database = process.env.PG_DEFAULT_DB || 'postgres';

    const initKnex = require('knex')(initConfig);
    let migrationKnex = null;

    process.stdout.write('\n');
    console.log(`${chalk.yellow.bold('Host:')} ${PG_CONNECTION.host}`);
    console.log(`${chalk.yellow.bold('User:')} ${PG_CONNECTION.user}`);
    console.log(`${chalk.yellow.bold('Database:')} ${PG_CONNECTION.database}`);
    process.stdout.write('\n');

    process.stdout.write(
      chalk.cyan(`Attempting to drop DB ${PG_CONNECTION.database}... `)
    );
    await initKnex.raw(DROP_DB);
    process.stdout.write(chalk.green('✓\n'));

    process.stdout.write(
      chalk.cyan(`Attempting to create DB ${PG_CONNECTION.database}... `)
    );
    await initKnex.raw(CREATE_DB);
    process.stdout.write(chalk.green('✓\n'));

    process.stdout.write(chalk.cyan(`Attempting to run migrations... `));
    migrationKnex = require('knex')(migrationConfig);
    const migration = await migrationKnex.migrate.latest(migrationConfig);
    process.stdout.write(chalk.green(`✓\n`));
    if (migration[1].length) {
      const list = migration[1]
        .map((m) => `  - ${path.basename(m)}\n`)
        .join('\n');
      process.stdout.write(chalk.magenta(`${list}\n`));
    } else {
      process.stdout.write(chalk.magenta('  - no migrations to run\n'));
    }
  } catch (e) {
    process.stdout.write(chalk.red.bold('¯\\_(FAIL)_/¯\n'));
    console.log(e);
    console.log(e.stack);
    code = 1;
  } finally {
    process.exit(code);
  }
})();
