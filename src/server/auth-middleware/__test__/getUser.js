import test from 'ava'
import {getUser} from '../index'
import User from '../../models/User'

test.before('Reset the database', async () => {
  await User._knex.migrate.rollback()
  await User._knex.migrate.latest()
})

test.serial('req.USER_RECORD should be null when user does not exist', async t => {
  const req = { session: { auth: { username: 'fakeuser' } } }
  const res = {}
  const next = function() {}
  await getUser(req, res, next)
  t.is(req.USER_RECORD, null)
})

test.serial('req.USER_RECORD should not be null when user exists', async t => {
  const req = { session: { auth: { username: 'fakeuser' } } }
  const res = {}
  const next = function() {}
  const user = await User.forge({
    username: 'fakeuser',
    lastname: 'User',
    firstnames: 'Fake',
    barcode: '12345'
  }).save()
  await getUser(req, res, next)
  t.not(req.USER_RECORD, null)
})
