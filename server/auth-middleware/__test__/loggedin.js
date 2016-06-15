import test from 'ava'
import sinon from 'sinon'
import {mockReq, mockRes} from 'sinon-express-mock'

import {loggedin, __RewireAPI__ as AsyncLoggedinAPI} from '../index'

// Session tests
test('Calling `loggedin` with no session should redirect', t => {
  const next = sinon.spy()
  const req = mockReq()
  const res = mockRes({ redirectToLogin: sinon.spy() })
  loggedin(req, res, next)
  t.true(res.redirectToLogin.calledOnce)
  t.false(next.calledOnce)
})

test('Calling `loggedin` with a session should call `next`', async t => {
  const next = sinon.spy()
  const req = mockReq({
    session: { auth: { status: true } },
    originalUrl: '/'
  })
  const res = mockRes()
  loggedin(req, res, next)
  t.true(next.calledOnce)
  t.is(next.getCall(0).args.length, 0)
})

// JWT tests
test('Calling `loggedin` as an API req and with a JWT should call `next` with no error', async t => {
  AsyncLoggedinAPI.__Rewire__('verifyJwt', () => {
    return Promise.resolve({
      sub: "fakeymcfakeuser",
      iss: "dashboard",
      iat: Date.now(),
      exp: Date.now() + 3600
    })
  })
  const next = sinon.spy()
  const req = mockReq({
    isApiRequest: true,
    session: {},
    headers: {
      authorization: "Bearer 1234"
    },
    app: {
      get: thing => thing
    }
  })
  await loggedin(req, mockRes(), next)
  t.true(next.calledOnce)
  t.is(req.username, 'fakeymcfakeuser')
  t.is(next.getCall(0).args.length, 0)
  AsyncLoggedinAPI.__ResetDependency__('verifyJwt')
})

test('Calling `loggedin` as an API req and with an invalid JWT should call `next` with an` error', async t => {
  const next = sinon.spy()
  const req = mockReq({
    isApiRequest: true,
    session: {},
    headers: {
      authorization: "Bearer LOLNOPE"
    },
    app: {
      get: thing => thing
    }
  })
  await loggedin(req, mockRes(), next)
  t.true(next.calledOnce)
  t.is(next.getCall(0).args.length, 1)
})

test('Calling `loggedin` as an API req without a token should call res.redirectToLogin', async t => {
  const req = mockReq({
    isApiRequest: true,
    session: {},
    headers: {}
  })
  const res = mockRes({
    status: sinon.spy(function() { return this }),
    send: sinon.spy(function() { return this }),
    redirectToLogin: sinon.spy()
  })
  await loggedin(req, res, () => {})
  t.true(res.redirectToLogin.calledOnce)
})

test('Calling `loggedin` as an API req with a non-bearer token should call res.redirectToLogin', async t => {
  const req = mockReq({
    isApiRequest: true,
    session: {},
    headers: {
      authorization: "Basic LOLNOPE"
    }
  })
  const res = mockRes({
    status: sinon.spy(function() { return this }),
    send: sinon.spy(function() { return this }),
    redirectToLogin: sinon.spy()
  })
  await loggedin(req, res, () => {})
  t.true(res.redirectToLogin.calledOnce)
})
