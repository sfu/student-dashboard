import test from 'ava'
import {mockReq, mockRes} from 'sinon-express-mock'
import sinon from 'sinon'
import {provisionOrUpdateUser, __RewireAPI__ as AsyncGetUserBioRewireAPI} from '../index'
import db from '../../db'

const fakeUser = {
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

test.before('Reset the database', async () => {
  await db.migrate.rollback()
  await db.migrate.latest()

  // rewire the getUserBio function called by provisionOrUpdateUser
  AsyncGetUserBioRewireAPI.__Rewire__('getUserBio', function() {
    return Promise.resolve(fakeUser)
  })
})

test('Provision a user when none exists', async t => {
  const req = mockReq({
    OAUTH_CREDENTIALS: { access_token: 'xxx', refresh_token: 'xxx' },
    session: { auth: { username: 'fakeuser' } }
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.is(req.session.user.username, 'fakeuser')
  t.truthy(req.session.user.uid)
})

test('Update a user when one exists', async t => {
  const req = mockReq({
    USER_RECORD: fakeUser,
    OAUTH_CREDENTIALS: { access_token: 'updated', refresh_token: 'xxx' },
    session: { auth: { username: 'fakeuser' }, user: fakeUser}
  })
  const res = mockRes()
  const next = sinon.spy()
  await provisionOrUpdateUser(req, res, next)
  t.not(next.getCall(0).args.length > 0) // next should not have been called with an error
  t.is(req.session.user.access_token, 'updated')
})
