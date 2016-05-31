import test from 'ava'
import {mockReq, mockRes} from 'sinon-express-mock'
import {getUser} from '../index'
import db from '../../db'

test.before('Reset the database', async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test.serial('req.USER_RECORD should be null when user does not exist', async t => {
  const req = mockReq({ session: { auth: { username: 'fakeuser' } } })
  await getUser(req, mockRes(), () => {})
  t.is(req.USER_RECORD, null)
})

test.serial('req.USER_RECORD should not be null when user exists', async t => {
  const req = mockReq({ session: { auth: { username: 'fakeuser' } } })
  await db('users').insert({
    username: 'fakeuser',
    lastname: 'User',
    firstnames: 'Fake',
    barcode: '12345'
  })
  await getUser(req, mockRes(), () => {})
  t.not(req.USER_RECORD, null)
})
