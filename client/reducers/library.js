import {
  FETCH_LIBRARY_HOURS_START,
  FETCH_LIBRARY_HOURS_SUCCESS,
  FETCH_LIBRARY_HOURS_ERROR
} from '../actions/library'

export const DEFAULT = {
  hours: {
    data: null,
    fetching: false,
    error: null,
    lastUpdated: null,
  }
}

export default (state = DEFAULT, action) => {
  console.log(action, state)
  switch (action.type) {
    case FETCH_LIBRARY_HOURS_START: {
      const nextState = { ...state }
      nextState.hours.fetching = true
      return nextState
    }
    case FETCH_LIBRARY_HOURS_SUCCESS: {
      const nextState = {
        ...state,
        hours: {
          ...state.hours,
          fetching: false,
          error: null,
          data: action.payload.data,
          lastUpdated: action.payload.lastUpdated || Date.now()
        }
       }
      return nextState
    }
    case FETCH_LIBRARY_HOURS_ERROR:
      return {
        ...state,
        hours: {
          ...state.hours,
          fetching: false,
          error: action.payload.error
        }
      }
    default:
      return state
  }
}
