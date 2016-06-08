import test from 'ava'
import {mockReq, mockRes} from 'sinon-express-mock'
import {getUser} from '../index'
import db from '../../db'

const FAKEUSER = {
  username: 'fakeuser',
  lastname: 'User',
  firstnames: 'Fake',
  barcode: '12345'
}

test.beforeEach('Reset the database', async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test('req.user should be null when user does not exist - session', async t => {
  const req = mockReq({ username: 'fakeuser', session: { auth: { username: 'fakeuser' } } })
  await getUser(req, mockRes(), () => {})
  t.is(req.user, null)
})

test('req.user should be null when user does not exist - req.username', async t => {
  const req = mockReq({ username: 'fakeuser'})
  await getUser(req, mockRes(), () => {})
  t.is(req.user, null)
})

test('req.user should not be null when user exists - session', async t => {
  const req = mockReq({ username: 'fakeuser', session: { auth: { username: 'fakeuser' } } })
  await db('users').insert(FAKEUSER)
  await getUser(req, mockRes(), () => {})
  t.not(req.user, null)
})

test('req.user should not be null when user exists - req.username', async t => {
  const req = mockReq({ username: 'fakeuser'})
  await db('users').insert(FAKEUSER)
  await getUser(req, mockRes(), () => {})
  t.not(req.user, null)
})
