const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');
const { authenticateCasUser } = require('../index');
const cas = require('../../cas-client');

describe('authenticateUser', () => {
  it('Calling authenticateCasUser calls `cas.authenticate`', () => {
    const next = sinon.spy();
    const req = mockReq();
    const res = mockRes({ redirect: sinon.spy() });
    sinon.stub(cas, 'authenticate');
    authenticateCasUser(req, res, next);
    expect(cas.authenticate.calledOnce).toBe(true);
  });
});
