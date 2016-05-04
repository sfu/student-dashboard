import test from 'ava'
import sinon from 'sinon'
import {loggedin} from '../index'

test('Calling `loggedin` with no session should redirect', t => {
  const next = sinon.spy()
  const req = { session: {} }
  const res = { redirect: sinon.spy() }
  loggedin(req, res, next)
  t.true(res.redirect.calledOnce)
})

test('Calling `loggedin` with a session should call `next`', t => {
  const next = sinon.spy()
  const req = {
    session: { auth: { status: true } },
    originalUrl: '/'
  }
  const res = {}
  loggedin(req, res, next)
  t.true(next.calledOnce)
})
