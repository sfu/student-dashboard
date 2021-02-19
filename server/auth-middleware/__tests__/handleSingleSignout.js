const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');

const { handleSingleSignout } = require('../index');
const cas = require('../../cas-client');

describe('handleSingleSignout', () => {
  it('Calling `handleSingleSignout` calls the right things', () => {
    const next = sinon.spy();
    const req = mockReq();
    const res = mockRes();
    sinon.stub(cas, 'handleSingleSignout');
    handleSingleSignout(req, res, next);
    expect(cas.handleSingleSignout.calledOnce).toBe(true);
  });
});
