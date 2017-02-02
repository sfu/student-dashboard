import loadUser from '../loadUser'
const tracker = require('mock-knex').getTracker()

describe('loadUser', () => {
  beforeEach(async () => {
    tracker.install()
  })

  afterEach(async () => {
    tracker.uninstall()
  })


  it('loadUser returns `null` when no matching user found', async () => {
    tracker.on('query', q => {
      q.response([])
    })

    const user = await loadUser('fakeuser')
    expect(user).toBe(null)
  })

  it('loadUser returns a user when one is found', async () => {
    tracker.on('query', q => {
      q.response([{
        username: 'fakeuser',
        lastname: 'User',
        firstnames: 'Fake',
        barcode: '12345'
      }])
    })

    const user = await loadUser('fakeuser')
    expect(user.username).toBe('fakeuser')
  })

  it('loadUser returns a user with only specified fields', async () => {
    tracker.on('query', q => {
      q.response([{
        id: 1,
        username: 'fakeuser'
      }])
    })
    const user = await loadUser('fakeuser', ['id', 'username'])
    const keys = Object.keys(user)
    expect(keys.includes('id')).toBe(true)
    expect(keys.includes('username')).toBe(true)
    expect(keys.includes('lastname')).toBe(false)
  })
})
