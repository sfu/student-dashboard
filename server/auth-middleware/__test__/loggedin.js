import test from 'ava'
import sinon from 'sinon'
import {loggedin, __RewireAPI__ as AsyncLoggedinAPI} from '../index'

// Session tests
test('Calling `loggedin` with no session should redirect', t => {
  const next = sinon.spy()
  const req = { session: {} }
  const res = { redirect: sinon.spy() }
  loggedin(req, res, next)
  t.true(res.redirect.calledOnce)
  t.false(next.calledOnce)
})

test('Calling `loggedin` with a session should call `next`', async t => {
  const next = sinon.spy()
  const req = {
    session: { auth: { status: true } },
    originalUrl: '/'
  }
  const res = {}
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
  const req = {
    isApiRequest: true,
    session: {},
    headers: {
      authorization: "Bearer 1234"
    },
    app: {
      get: thing => thing
    }
  }
  await loggedin(req, {}, next)
  t.true(next.calledOnce)
  t.is(next.getCall(0).args.length, 0)
  AsyncLoggedinAPI.__ResetDependency__('verifyJwt')
})

test('Calling `loggedin` as an API req and with an invalid JWT should call `next` with an` error', async t => {
  const next = sinon.spy()
  const req = {
    isApiRequest: true,
    session: {},
    headers: {
      authorization: "Bearer LOLNOPE"
    },
    app: {
      get: thing => thing
    }
  }
  await loggedin(req, {}, next)
  t.true(next.calledOnce)
  t.is(next.getCall(0).args.length, 1)
})

test('Calling `loggedin` as an API req without a token should return a 401', async t => {
  const req = {
    isApiRequest: true,
    session: {},
    headers: {}
  }
  const res = {}
  res.status = sinon.spy(function() { return this })
  res.send = sinon.spy(function() { return this })
  await loggedin(req, res, () => {})
  t.true(res.status.calledOnce)
  t.is(res.status.getCall(0).args[0], 401)
  t.is(res.send.getCall(0).args[0].status, 'unauthenticated')
})

test('Calling `loggedin` as an API req with a non-bearer token should return a 401', async t => {
  const req = {
    isApiRequest: true,
    session: {},
    headers: {
      authorization: "Basic LOLNOPE"
    }
  }
  const res = {}
  res.status = sinon.spy(function() { return this })
  res.send = sinon.spy(function() { return this })
  await loggedin(req, res, () => {})
  t.true(res.status.calledOnce)
  t.is(res.status.getCall(0).args[0], 401)
  t.is(res.send.getCall(0).args[0].status, 'unauthenticated')
})
