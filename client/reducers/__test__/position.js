import test from 'ava'
import position, { DEFAULT } from '../position'

test('returns default state when no action passed', t => {
  const nextState = position(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('GET_POSITION_START', t => {
  const nextState = position(DEFAULT, { type: 'GET_POSITION_START' })
  const expected = Object.assign({}, DEFAULT)
  expected.locating = true
  t.deepEqual(nextState, expected)
})

test('GET_POSITION_ERROR', t => {
  const nextState = position(DEFAULT, {
    type: 'GET_POSITION_ERROR',
    error: {code: 2, message: ''}
  })
  const expected = Object.assign({}, DEFAULT)
  expected.locating =false
  expected.error = { code: 2, message: '' }
  expected.lastUpdated = null
  expected.coords = null
  t.deepEqual(nextState, expected)
})

test('GET_POSITION_SUCCESS', t => {
  const now = Date.now()
  const nextState = position(DEFAULT, {
    type: 'GET_POSITION_SUCCESS',
    position: {
      coords: {
        latitude: 49,
        longitude: -123,
        accuracy: 10
      },
      lastUpdated: now
    }
  })

  const expected = Object.assign({}, DEFAULT)
  expected.coords = {
    latitude: 49,
    longitude: -123,
    accuracy: 10
  }
  expected.lastUpdated = now
  t.deepEqual(nextState, expected)
})
