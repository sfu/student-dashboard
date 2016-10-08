import test from 'ava'
import {mockReq, mockRes} from 'sinon-express-mock'
import sinon from 'sinon'
import {provisionOrUpdateUser, __RewireAPI__ as RewireAPI} from '../index' // eslint-disable-line
import db from '../../db'

const FAKEUSERBIO = {
  uid: 12345,
  isSponsored: 'false',
  username: 'fakeuser',
  status: 'active',
  roles: [
    'undergrad'
  ],
  lastname: 'User',
  barcode: '12345678901234',
  commonname: 'Fake',
  firstnames: 'Fakey McFake',
  sfuid: '123456789'
}

const FAKEUSER = {
  username: 'fakeuser',
  lastname: 'User',
  firstnames: 'Fakey McFake',
  commonname: 'Fake',
  barcode: '12345678901234'
}

const FAKEOAUTH = {
  access_token: 'lol',
  refresh_token: 'wtf',
  expires_in: 3600,
  valid_until: 0
}

const insertFakeUser = async () => {
  const res = await db('users').insert(FAKEUSER).returning('*')
  return res[0]
}

test.beforeEach('Reset the database', async () => {
  await db.migrate.rollback()
  await db.migrate.latest()

  // rewire the getUserBio function called by provisionOrUpdateUser
  RewireAPI.__Rewire__('getUserBio', function() {
    return Promise.resolve(FAKEUSERBIO)
  })

  // rewire the getProxyTicket function called by provisionOrUpdateUser
  RewireAPI.__Rewire__('getAccessToken', () => {
    return Promise.resolve({data: FAKEOAUTH})
  })
})

test('Provision a user when none exists', async t => {
  const req = mockReq({
    username: 'fakeuser'
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.is(req.user.username, 'fakeuser')
  t.truthy(req.user.uid)
})

test('Call next() when a user already exists, do not update', async t => {
  const fakeUser = await insertFakeUser()
  const req = mockReq({
    user: fakeUser,
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.true(next.calledOnce)
})

test('Should call next when is an API request', async t => {
  const fakeUser = await insertFakeUser()
  const req = mockReq({
    isApiRequest: true,
    username: 'fakeuser',
    user: fakeUser
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.true(next.calledOnce)
})
