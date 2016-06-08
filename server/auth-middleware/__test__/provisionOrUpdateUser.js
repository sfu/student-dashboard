import test from 'ava'
import {mockReq, mockRes} from 'sinon-express-mock'
import sinon from 'sinon'
import {provisionOrUpdateUser, __RewireAPI__ as AsyncGetUserBioRewireAPI} from '../index'
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

const insertFakeUser = async () => {
  const res = await db('users').insert(FAKEUSER).returning('*')
  return res[0]
}

test.beforeEach('Reset the database', async () => {
  await db.migrate.rollback()
  await db.migrate.latest()

  // rewire the getUserBio function called by provisionOrUpdateUser
  AsyncGetUserBioRewireAPI.__Rewire__('getUserBio', function() {
    return Promise.resolve(FAKEUSERBIO)
  })
})

test('Provision a user when none exists', async t => {
  const req = mockReq({
    OAUTH_CREDENTIALS: { access_token: 'xxx', refresh_token: 'xxx' },
    username: 'fakeuser'
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.is(req.user.username, 'fakeuser')
  t.truthy(req.user.uid)
})

test('Update a user when one exists and not try to update user', async t => {
  const fakeUser = await insertFakeUser()
  const req = mockReq({
    user: fakeUser,
    OAUTH_CREDENTIALS: { access_token: 'updated', refresh_token: 'xxx' }
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.not(next.getCall(0).args.length > 0) // next should not have been called with an error
  t.is(req.user.access_token, 'updated')
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
