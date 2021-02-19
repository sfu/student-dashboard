const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');

const { loggedin, __RewireAPI__: AsyncLoggedinAPI } = require('../index'); // eslint-disable-line

describe('loggedIn', () => {
  describe('Session tests', () => {
    it('Calling `loggedin` with no session should redirect', () => {
      const next = sinon.spy();
      const req = mockReq();
      const res = mockRes({ redirectToLogin: sinon.spy() });
      loggedin(req, res, next);
      expect(res.redirectToLogin.calledOnce).toBe(true);
      expect(next.calledOnce).toBe(false);
    });

    it('Calling `loggedin` with a session should call `next`', async () => {
      const next = sinon.spy();
      const req = mockReq({
        session: { auth: { status: true } },
        originalUrl: '/',
      });
      const res = mockRes();
      loggedin(req, res, next);
      expect(next.calledOnce).toBe(true);
      expect(next.getCall(0).args.length).toBe(0);
    });
  });

  describe('JWT tests', () => {
    it('Calling `loggedin` as an API req and with a JWT should call `next` with no error', async () => {
      AsyncLoggedinAPI.__Rewire__('verifyJwt', () => {
        return Promise.resolve({
          sub: 'fakeymcfakeuser',
          iss: 'dashboard',
          iat: Date.now(),
          exp: Date.now() + 3600,
        });
      });
      const next = sinon.spy();
      const req = mockReq({
        isApiRequest: true,
        session: {},
        headers: {
          authorization: 'Bearer 1234',
        },
        app: {
          get: (thing) => thing,
        },
      });
      await loggedin(req, mockRes(), next);
      expect(next.calledOnce).toBe(true);
      expect(req.username).toBe('fakeymcfakeuser');
      expect(next.getCall(0).args.length).toBe(0);
      AsyncLoggedinAPI.__ResetDependency__('verifyJwt');
    });

    it('Calling `loggedin` as an API req and with an invalid JWT should call `next` with an` error', async () => {
      const next = sinon.spy();
      const req = mockReq({
        isApiRequest: true,
        session: {},
        headers: {
          authorization: 'Bearer LOLNOPE',
        },
        app: {
          get: (thing) => thing,
        },
      });
      await loggedin(req, mockRes(), next);
      expect(next.calledOnce).toBe(true);
      expect(next.getCall(0).args.length).toBe(1);
    });

    it('Calling `loggedin` as an API req without a token should call res.redirectToLogin', async () => {
      const req = mockReq({
        isApiRequest: true,
        session: {},
        headers: {},
      });
      const res = mockRes({
        status: sinon.spy(function () {
          return this;
        }),
        send: sinon.spy(function () {
          return this;
        }),
        redirectToLogin: sinon.spy(),
      });
      await loggedin(req, res, () => {});
      expect(res.redirectToLogin.calledOnce).toBe(true);
    });

    it('Calling `loggedin` as an API req with a non-bearer token should call res.redirectToLogin', async () => {
      const req = mockReq({
        isApiRequest: true,
        session: {},
        headers: {
          authorization: 'Basic LOLNOPE',
        },
      });
      const res = mockRes({
        status: sinon.spy(function () {
          return this;
        }),
        send: sinon.spy(function () {
          return this;
        }),
        redirectToLogin: sinon.spy(),
      });
      await loggedin(req, res, () => {});
      expect(res.redirectToLogin.calledOnce).toBe(true);
    });
  });
});
