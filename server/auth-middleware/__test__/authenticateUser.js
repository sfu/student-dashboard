import test from 'ava'
import sinon from 'sinon'
import {mockReq, mockRes} from 'sinon-express-mock'
import {authenticateCasUser} from '../index'
import cas from '../../cas-client'

test('Calling with a user sesison calls `next`', t => {
  const next = sinon.spy()
  const req = mockReq({
    session: { auth: { status: true } }
  })
  const res = mockRes()
  authenticateCasUser(req, res, next)
  t.true(next.calledOnce)
})

test('Calling without a user session calls `cas.authenticate`', t => {
  const next = sinon.spy()
  const req = mockReq()
  const res = mockRes({ redirect: sinon.spy() })
  sinon.stub(cas, 'authenticate')
  authenticateCasUser(req, res, next)
  t.true(cas.authenticate.calledOnce)
})
