import test from 'ava'
import sinon from 'sinon'
import {authenticateUser} from '../index'
import cas from '../../cas-client'

test('Calling with a user sesison calls `next`', t => {
  const next = sinon.spy()
  const req = {
    session: { auth: { status: true } }
  }
  const res = {}
  authenticateUser(req, res, next)
  t.true(next.calledOnce)
})

test('Calling without a user session calls `cas.authenticate`', t => {
  const next = sinon.spy()
  const req = { session: {} }
  const res = { redirect: sinon.spy() }
  sinon.stub(cas, 'authenticate')
  authenticateUser(req, res, next)
  t.true(cas.authenticate.calledOnce)
})
