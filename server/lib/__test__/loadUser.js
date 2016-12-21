import test from 'ava'
import loadUser from '../loadUser'
const tracker = require('mock-knex').getTracker()

test.beforeEach('Install tracker', async () => {
  tracker.install()
})

test.afterEach('Reset the database', async () => {
  tracker.uninstall()
})


test('loadUser returns `null` when no matching user found', async t => {
  tracker.on('query', q => {
    q.response([])
  })

  const user = await loadUser('fakeuser')
  t.is(user, null)
})

test('loadUser returns a user when one is found', async t => {
  tracker.on('query', q => {
    q.response([{
      username: 'fakeuser',
      lastname: 'User',
      firstnames: 'Fake',
      barcode: '12345'
    }])
  })

  const user = await loadUser('fakeuser')
  t.is(user.username, 'fakeuser')
})

test('loadUser returns a user with only specified fields', async t => {
  tracker.on('query', q => {
    q.response([{
      id: 1,
      username: 'fakeuser'
    }])
  })
  const user = await loadUser('fakeuser', ['id', 'username'])
  const keys = Object.keys(user)
  t.true(keys.includes('id'))
  t.true(keys.includes('username'))
  t.false(keys.includes('lastname'))
})
