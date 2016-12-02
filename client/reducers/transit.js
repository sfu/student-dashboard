import {
  FETCH_STOPS_START,
  FETCH_STOPS_SUCCESS,
  FETCH_STOPS_ERROR,
  SHOW_CURRENT_LOCATION_ON_MAP,
  LOCATE_ON_MOUNT,
  UPDATE_MAP_CENTER,
  UPDATE_MAP_ZOOM,
  SET_SELECTED_STOP,
  FETCH_SCHEDULE_FOR_BUS_STOP_START,
  FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS,
  FETCH_SCHEDULE_FOR_BUS_STOP_ERROR
} from '../actions/transit'
import L from 'leaflet'

export const DEFAULT = {
  /* stops */
  fetchingStops: false,
  fetchStopsError: null,
  stops: [],

  /* map/positioning */
  forceMapUpdate: false,
  showCurrentLocationOnMap: false,
  mapCenter: new L.latLng(49.21490, -123.00018),
  mapZoom: 10,
  locateOnMount: true,

  /* schedules for selected stop */
  selectedStop: null,
  fetchingSchedules: false,
  fetchSchedulesError: null,
  schedulesForSelectedStop: [],
  schedulesFetchedAt: null
}

export default (state = DEFAULT, action) => {
  const { type } = action
  switch (type) {
    case FETCH_STOPS_START:
      return {
        ...state,
        fetchingStops: true,
        fetchStopsError: null,
        forceMapUpdate: false
      }
    case FETCH_STOPS_SUCCESS:
      return {
        ...state,
        fetchingStops: false,
        stops: action.stops,
        fetchStopsError: null,
        forceMapUpdate: true
      }
    case FETCH_STOPS_ERROR:
      return {
        ...state,
        fetchingStops: false,
        fetchStopsError: action.error,
        forceMapUpdate: true
      }
    case SHOW_CURRENT_LOCATION_ON_MAP:
      return {
        ...state,
        showCurrentLocationOnMap: action.showCurrentLocationOnMap
      }
    case LOCATE_ON_MOUNT:
      console.log({state, action})
      return {
        ...state,
        locateOnMount: action.locateOnMount
      }
    case UPDATE_MAP_CENTER:
      return {
        ...state,
        mapCenter: action.mapCenter
      }
    case UPDATE_MAP_ZOOM:
      return {
        ...state,
        mapZoom: action.mapZoom
      }
    case SET_SELECTED_STOP:
      return {
        ...state,
        selectedStop: action.stop
      }
    case FETCH_SCHEDULE_FOR_BUS_STOP_START:
      return {
        ...state,
        fetchingSchedules: true,
        fetchSchedulesError: null,
        schedulesForSelectedStop: [],
        schedulesFetchedAt: null
      }
    case FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS:
      return {
        ...state,
        fetchingSchedules: false,
        fetchSchedulesError: null,
        schedulesForSelectedStop: action.schedulesForSelectedStop,
        schedulesFetchedAt: action.fetchedAt
      }
    case FETCH_SCHEDULE_FOR_BUS_STOP_ERROR:
      return {
        ...state,
        fetchingSchedules: false,
        fetchSchedulesError: action.error,
        schedulesForSelectedStop: [],
        schedulesFetchedAt: null
      }
    default:
      return state
  }
}
