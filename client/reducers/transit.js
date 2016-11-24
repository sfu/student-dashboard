import {
  FETCH_STOPS_START,
  FETCH_STOPS_SUCCESS,
  FETCH_STOPS_ERROR,
  TOGGLE_CURRENT_LOCATION_ON_MAP,
  SET_SELECTED_STOP
} from '../actions/transit'

export const DEFAULT = {
  fetching: false,
  fetchError: null,
  forceMapUpdate: false,
  stops: [],
  showCurrentLocationOnMap: false,
  selectedStop: null
}

export default (state = DEFAULT, action) => {
  const { type } = action
  switch (type) {
    case FETCH_STOPS_START:
      return {
        ...state,
        fetching: true,
        fetchError: null,
        forceMapUpdate: false
      }
    case FETCH_STOPS_SUCCESS:
      return {
        ...state,
        fetching: false,
        stops: action.stops,
        fetchError: null,
        forceMapUpdate: true
      }
    case FETCH_STOPS_ERROR:
      return {
        ...state,
        fetching: false,
        fetchError: action.error,
        forceMapUpdate: true
      }
    case TOGGLE_CURRENT_LOCATION_ON_MAP:
      return {
        ...state,
        showCurrentLocationOnMap: !state.showCurrentLocationOnMap
      }
    case SET_SELECTED_STOP:
      return {
        ...state,
        selectedStop: action.stop
      }
    default:
      return state
  }
}
