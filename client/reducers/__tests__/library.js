import { default as library, DEFAULT } from '../library';

describe('Library Reducer', () => {
  it('returns default state when no action passed', () => {
    const nextState = library(undefined, {});
    expect(nextState).toEqual(DEFAULT);
  });

  it('FETCH_LIBRARY_HOURS_START', () => {
    const nextState = library(DEFAULT, { type: 'FETCH_LIBRARY_HOURS_START' });
    const expected = Object.assign({}, DEFAULT);
    expected.hours.fetching = true;
    expected.hours.error = null;
    expect(nextState).toEqual(expected);
  });

  it('FETCH_LIBRARY_HOURS_SUCCESS', () => {
    const now = Date.now();
    const startState = {
      ...DEFAULT,
      hours: {
        ...DEFAULT.hours,
        fetching: true,
        error: null,
      },
    };

    const expected = {
      ...startState,
      hours: {
        ...startState.hours,
        fetching: false,
        error: null,
        data: ['something'],
        lastUpdated: now,
      },
    };

    const nextState = library(startState, {
      type: 'FETCH_LIBRARY_HOURS_SUCCESS',
      payload: {
        data: ['something'],
        lastUpdated: now,
      },
    });

    expect(nextState).toEqual(expected);
  });

  it('FETCH_LIBRARY_HOURS_ERROR', () => {
    const startState = {
      ...DEFAULT,
      hours: {
        ...DEFAULT.hours,
        fetching: true,
        error: null,
        data: ['something'],
        lastUpdated: 1234567890,
      },
    };

    const expected = {
      ...startState,
      hours: {
        ...startState.hours,
        fetching: false,
        error: 'oops',
      },
    };

    const nextState = library(startState, {
      type: 'FETCH_LIBRARY_HOURS_ERROR',
      payload: {
        error: 'oops',
      },
    });

    expect(nextState).toEqual(expected);
  });
});
