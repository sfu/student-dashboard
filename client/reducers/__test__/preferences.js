import test from 'ava'
import preferences, { DEFAULT } from '../preferences'

test('Default', t => {
  const nextState = preferences(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('SYNC_PREFERENCES_START', t => {
  const nextState = preferences(DEFAULT, {
    type: 'SYNC_PREFERENCES_START'
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: true,
    syncPreferencesError: null
  }
  t.deepEqual(nextState, expected)
})

test('SYNC_PREFERENCES_SUCCESS', t => {
  const nextState = preferences(DEFAULT, {
    type: 'SYNC_PREFERENCES_SUCCESS'
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: false,
    syncPreferencesError: null
  }
  t.deepEqual(nextState, expected)
})

test('SYNC_PREFERENCES_ERROR', t => {
  const nextState = preferences(DEFAULT, {
    type: 'SYNC_PREFERENCES_ERROR',
    error: 'something went boom'
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: false,
    syncPreferencesError: 'something went boom'
  }
  t.deepEqual(nextState, expected)
})

test('SET_PREFERENCES', t => {
  const nextState = preferences(DEFAULT, {
    type: 'SET_PREFERENCES',
    preferences: {
      somePref: 'someValue'
    }
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: false,
    syncPreferencesError: null,
    preferenceData: {
      somePref: 'someValue'
    }
  }
  t.deepEqual(nextState, expected)
})
