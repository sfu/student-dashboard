import test from 'ava'
import sinon from 'sinon'
import {mockReq, mockRes} from 'sinon-express-mock'

import {handleSingleSignout} from '../index'
import cas from '../../cas-client'

test('Calling `handleSingleSignout` calls the right things', t => {
  const next = sinon.spy()
  const req = mockReq()
  const res = mockRes()
  sinon.stub(cas, 'handleSingleSignout')
  handleSingleSignout(req, res, next)
  t.true(cas.handleSingleSignout.calledOnce)
})
