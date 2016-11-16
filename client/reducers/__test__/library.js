import test from 'ava'
import { default as library, DEFAULT } from '../library'

test('returns default state when no action passed', t => {
  const nextState = library(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('FETCH_LIBRARY_HOURS_START', t => {
  const nextState = library(DEFAULT, { type: 'FETCH_LIBRARY_HOURS_START' })
  const expected = Object.assign({}, DEFAULT)
  expected.hours.fetching = true
  expected.hours.error = null
  t.deepEqual(nextState, expected)
})

test('FETCH_LIBRARY_HOURS_SUCCESS', t => {
  const startState = {
    ...DEFAULT,
    hours: {
      ...DEFAULT.hours,
      fetching: true,
      error: null
    }
  }

  const expected = {
    ...startState,
    hours: {
      ...startState.hours,
      fetching: false,
      error: null,
      data: ['something'],
      lastUpdated: Date.now()
    }
  }

  const nextState = library(startState, {
    type: 'FETCH_LIBRARY_HOURS_SUCCESS',
    payload: {
      data: ['something'],
      lastUpdated: Date.now()
    }
  })

  t.deepEqual(nextState, expected)
})

test('FETCH_LIBRARY_HOURS_ERROR', t => {
  const startState = {
    ...DEFAULT,
    hours: {
      ...DEFAULT.hours,
      fetching: true,
      error: null,
      data: ['something'],
      lastUpdated: 1234567890
    }
  }

  const expected = {
    ...startState,
    hours: {
      ...startState.hours,
      fetching: false,
      error: 'oops',
    }
  }

  const nextState = library(startState, {
    type: 'FETCH_LIBRARY_HOURS_ERROR',
    payload: {
      error: 'oops'
    }
  })

  t.deepEqual(nextState, expected)
})
