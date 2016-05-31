import test from 'ava'
import sinon from 'sinon'
import {handleSingleSignout} from '../index'
import cas from '../../cas-client'

test('Calling `handleSingleSignout` calls the right things', t => {
  const next = sinon.spy()
  const req = {}
  const res = {}
  sinon.stub(cas, 'handleSingleSignout')
  handleSingleSignout(req, res, next)
  t.true(cas.handleSingleSignout.calledOnce)
})
