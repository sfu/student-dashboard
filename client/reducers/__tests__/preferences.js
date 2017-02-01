import preferences, { DEFAULT } from '../preferences'

it('Default', () => {
  const nextState = preferences(undefined, {})
  expect(nextState).toEqual(DEFAULT)
})

it('SYNC_PREFERENCES_START', () => {
  const nextState = preferences(DEFAULT, {
    type: 'SYNC_PREFERENCES_START'
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: true,
    syncPreferencesError: null
  }
  expect(nextState).toEqual(expected)
})

it('SYNC_PREFERENCES_SUCCESS', () => {
  const nextState = preferences(DEFAULT, {
    type: 'SYNC_PREFERENCES_SUCCESS'
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: false,
    syncPreferencesError: null
  }
  expect(nextState).toEqual(expected)
})

it('SYNC_PREFERENCES_ERROR', () => {
  const nextState = preferences(DEFAULT, {
    type: 'SYNC_PREFERENCES_ERROR',
    error: 'something went boom'
  })
  const expected = {
    ...DEFAULT,
    syncingPreferences: false,
    syncPreferencesError: 'something went boom'
  }
  expect(nextState).toEqual(expected)
})

it('SET_PREFERENCES', () => {
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
  expect(nextState).toEqual(expected)
})
