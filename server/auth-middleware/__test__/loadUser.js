import test from 'ava'
import {loadUser} from '../index'
import db from '../../db'

test.before('Reset the database', async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test.serial('loadUser returns `null` when no matching user found', async t => {
  const user = await loadUser('fakeuser')
  t.is(user, null)
})

test.serial('loadUser returns a user when one is found', async t => {
  await db('users').insert({
    username: 'fakeuser',
    lastname: 'User',
    firstnames: 'Fake',
    barcode: '12345'
  })

  const user = await loadUser('fakeuser')
  t.is(user.username, 'fakeuser')
})

test.serial('loadUser returns a user with only specified fields', async t => {
  const user = await loadUser('fakeuser', ['id', 'username'])
  const keys = Object.keys(user)
  t.true(keys.includes('id'))
  t.true(keys.includes('username'))
  t.false(keys.includes('lastname'))
})
