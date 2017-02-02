import sinon from 'sinon'
import {mockReq, mockRes} from 'sinon-express-mock'
import {authenticateCasUser} from '../index'
import cas from '../../cas-client'

describe('authenticateUser', () => {
  it('Calling authenticateCasUser calls `cas.authenticate`', () => {
    const next = sinon.spy()
    const req = mockReq()
    const res = mockRes({ redirect: sinon.spy() })
    sinon.stub(cas, 'authenticate')
    authenticateCasUser(req, res, next)
    expect(cas.authenticate.calledOnce).toBe(true)
  })
})
