import test from 'ava'
import User from '../user'

test.before('Reset the database', async () => {
  await User._knex.migrate.rollback()
  await User._knex.migrate.latest()
})

test.serial('Should be no users', async t => {
  t.is(await User.forge().fetch(), null)
})

test.serial('A user should be created', async t => {
  const user = await User.forge({
    username: 'testuser',
    lastname: 'User',
    firstnames: 'Test',
    barcode: '1234',
    access_token: '1234',
    refresh_token: '1234'
  }).save()
  t.is(user.get('username'), 'testuser')
})
