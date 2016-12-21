import test from 'ava'
import { mockReq, mockRes} from 'sinon-express-mock'
import { getUser } from '../index'
const tracker = require('mock-knex').getTracker()

const FAKEUSER = {
  username: 'fakeuser',
  lastname: 'User',
  firstnames: 'Fake',
  barcode: '12345'
}

test.beforeEach('Install tracker', () => {
  tracker.install()
})

test.afterEach('Uninstall tracker', () => {
  tracker.uninstall()
})

test('req.user should be null when user does not exist - session', async t => {
  tracker.on('query', q => {
     q.response([])
  })

  const req = mockReq({ username: 'fakeuser', session: { auth: { username: 'fakeuser' } } })
  await getUser(req, mockRes(), () => {})
  t.is(req.user, null)
})

test('req.user should be null when user does not exist - req.username', async t => {
  tracker.on('query', q => {
     q.response([])
  })

  const req = mockReq({ username: 'fakeuser'})
  await getUser(req, mockRes(), () => {})
  t.is(req.user, null)
})

test('req.user should not be null when user exists - session', async t => {
  tracker.on('query', q => {
     q.response([FAKEUSER])
  })

  const req = mockReq({ username: 'fakeuser', session: { auth: { username: 'fakeuser' } } })
  await getUser(req, mockRes(), () => {})
  t.not(req.user, null)
})

test('req.user should not be null when user exists - req.username', async t => {
  tracker.on('query', q => {
     q.response([FAKEUSER])
  })

  const req = mockReq({ username: 'fakeuser'})
  await getUser(req, mockRes(), () => {})
  t.not(req.user, null)
})
