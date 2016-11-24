import {
  GET_POSITION_START,
  GET_POSITION_SUCCESS,
  GET_POSITION_ERROR
} from '../actions/position'

export const DEFAULT = {
  locating: false,
  error: null,
  lastUpdated: null,
  latitude: null,
  longitude: null,
  accuracy: null
}

export default (state = DEFAULT, action) => {
  switch (action.type) {
    case GET_POSITION_START:
      return {
        ...state,
        locating: true
      }

    case GET_POSITION_SUCCESS: {
      const {
        latitude,
        longitude,
        accuracy,
      } = action.position
      return {
        ...state,
        locating: false,
        error: null,
        latitude,
        longitude,
        accuracy,
        lastUpdated: action.position.timestamp
      }
    }

    case GET_POSITION_ERROR:
      return {
        ...state,
        locating: false,
        error: action.error,
        coords: null,
        lastUpdated: null
      }

    default:
      return state
  }
}
