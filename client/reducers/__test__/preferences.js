import test from 'ava'
import preferences, { DEFAULT } from '../preferences'

test('Default', t => {
  const nextState = preferences(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('GET_PREFERENCES', t => {
  const nextState = preferences(DEFAULT, {
    type: 'GET_PREFERENCES'
  })
  t.deepEqual(nextState, DEFAULT)
})

test('SET_PREFERENCE', t => {
  const nextState = preferences(DEFAULT, {
    type: 'SET_PREFERENCE',
    preference: 'timeFormat',
    value: '24h'
  })
  const expected = {
    ...DEFAULT,
    timeFormat: '24h'
  }
  t.deepEqual(nextState, expected)
})
