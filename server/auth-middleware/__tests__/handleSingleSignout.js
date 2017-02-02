import sinon from 'sinon'
import {mockReq, mockRes} from 'sinon-express-mock'

import {handleSingleSignout} from '../index'
import cas from '../../cas-client'

describe('handleSingleSignout', () => {
  it('Calling `handleSingleSignout` calls the right things', () => {
    const next = sinon.spy()
    const req = mockReq()
    const res = mockRes()
    sinon.stub(cas, 'handleSingleSignout')
    handleSingleSignout(req, res, next)
    expect(cas.handleSingleSignout.calledOnce).toBe(true)
  })
})
