import { mockReq, mockRes} from 'sinon-express-mock'
import { getUser } from '../index'
const tracker = require('mock-knex').getTracker()

describe('getUser', () => {
  const FAKEUSER = {
    username: 'fakeuser',
    lastname: 'User',
    firstnames: 'Fake',
    barcode: '12345'
  }

  beforeEach(() => {
    tracker.install()
  })

  afterEach(() => {
    tracker.uninstall()
  })

  it('req.user should be null when user does not exist - session', async () => {
    tracker.on('query', q => {
       q.response([])
    })

    const req = mockReq({ username: 'fakeuser', session: { auth: { username: 'fakeuser' } } })
    await getUser(req, mockRes(), () => {})
    expect(req.user).toBe(null)
  })

  it('req.user should be null when user does not exist - req.username', async () => {
    tracker.on('query', q => {
       q.response([])
    })

    const req = mockReq({ username: 'fakeuser'})
    await getUser(req, mockRes(), () => {})
    expect(req.user).toBe(null)
  })

  it('req.user should not be null when user exists - session', async () => {
    tracker.on('query', q => {
       q.response([FAKEUSER])
    })

    const req = mockReq({ username: 'fakeuser', session: { auth: { username: 'fakeuser' } } })
    await getUser(req, mockRes(), () => {})
    expect(req.user).not.toBe(null)
  })

  it('req.user should not be null when user exists - req.username', async () => {
    tracker.on('query', q => {
       q.response([FAKEUSER])
    })

    const req = mockReq({ username: 'fakeuser'})
    await getUser(req, mockRes(), () => {})
    expect(req.user).not.toBe(null)
  })

})
