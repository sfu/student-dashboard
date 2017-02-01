import position, { DEFAULT } from '../position'

it('returns default state when no action passed', () => {
  const nextState = position(undefined, {})
  expect(nextState).toEqual(DEFAULT)
})

it('GET_POSITION_START', () => {
  const nextState = position(DEFAULT, { type: 'GET_POSITION_START' })
  const expected = Object.assign({}, DEFAULT)
  expected.locating = true
  expect(nextState).toEqual(expected)
})

it('GET_POSITION_ERROR', () => {
  const nextState = position(DEFAULT, {
    type: 'GET_POSITION_ERROR',
    error: {code: 2, message: ''}
  })
  const expected = Object.assign({}, DEFAULT)
  expected.locating =false
  expected.error = { code: 2, message: '' }
  expected.lastUpdated = null
  expected.coords = null
  expect(nextState).toEqual(expected)
})

it('GET_POSITION_SUCCESS', () => {
  const now = Date.now()
  const nextState = position(DEFAULT, {
    type: 'GET_POSITION_SUCCESS',
    position: {
      latitude: 49,
      longitude: -123,
      accuracy: 10,
      timestamp: now
    }
  })

  const expected = {
    ...DEFAULT,
    latitude: 49,
    longitude: -123,
    accuracy: 10,
    lastUpdated: now

  }

  expect(nextState).toEqual(expected)
})
