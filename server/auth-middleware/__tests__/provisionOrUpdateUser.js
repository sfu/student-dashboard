import { mockReq, mockRes } from 'sinon-express-mock';
import sinon from 'sinon';
import {
  provisionOrUpdateUser,
  __RewireAPI__ as RewireAPI, // eslint-disable-line
} from '../index';
const tracker = require('mock-knex').getTracker();

describe('provisionOrUpdateUser', () => {
  const FAKEUSERBIO = {
    uid: 12345,
    isSponsored: 'false',
    username: 'fakeuser',
    status: 'active',
    roles: ['undergrad'],
    lastname: 'User',
    barcode: '12345678901234',
    commonname: 'Fake',
    firstnames: 'Fakey McFake',
    sfuid: '123456789',
  };

  const FAKEUSER = {
    username: 'fakeuser',
    lastname: 'User',
    firstnames: 'Fakey McFake',
    commonname: 'Fake',
    barcode: '12345678901234',
  };

  const FAKEOAUTH = {
    access_token: 'lol',
    refresh_token: 'wtf',
    expires_in: 3600,
    valid_until: 0,
  };

  beforeEach(async () => {
    tracker.install();
    tracker.on('query', (q) => {
      q.response({
        rows: [
          {
            ...FAKEUSER,
            ...FAKEOAUTH,
            uid: '1234-5678-9012-3456',
          },
        ],
      });
    });
    // rewire the getUserBio function called by provisionOrUpdateUser
    RewireAPI.__Rewire__('getUserBio', function () {
      return Promise.resolve(FAKEUSERBIO);
    });

    // rewire the getProxyTicket function called by provisionOrUpdateUser
    RewireAPI.__Rewire__('getAccessToken', () => {
      return Promise.resolve({ data: FAKEOAUTH });
    });
  });

  afterEach(() => {
    tracker.uninstall();
  });

  it('Provision a user when none exists', async () => {
    const req = mockReq({
      username: 'fakeuser',
    });
    const res = mockRes();
    const next = sinon.spy();
    await provisionOrUpdateUser(req, res, next);
    expect(req.user.username).toBe('fakeuser');
    expect(req.user.uid).toBeTruthy();
  });

  it('Call next() when a user already exists, do not update', async () => {
    const req = mockReq({
      user: { ...FAKEUSER, ...FAKEOAUTH },
    });
    const res = mockRes();
    const next = sinon.spy();
    await provisionOrUpdateUser(req, res, next);
    expect(next.calledOnce).toBe(true);
  });

  it('Should call next when is an API request', async () => {
    const req = mockReq({
      isApiRequest: true,
      username: 'fakeuser',
      user: { ...FAKEUSER, ...FAKEOAUTH },
    });
    const res = mockRes();
    const next = sinon.spy();
    await provisionOrUpdateUser(req, res, next);
    expect(next.calledOnce).toBe(true);
  });
});
