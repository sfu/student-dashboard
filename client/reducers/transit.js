import isEqual from 'lodash/isEqual'

import {
  ADD_TRANSIT_BOOKMARK,
  REMOVE_TRANSIT_BOOKMARK,
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

var hydratedBookmarks = []

if (window && window.localStorage) {
  try {
    hydratedBookmarks = JSON.parse(localStorage.getItem('transitBookmarks')) || []
  } catch (e) {
    () => {}
  }
}

export const DEFAULT = {
  /* bookmarks */
  transitBookmarks: hydratedBookmarks,

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
    case ADD_TRANSIT_BOOKMARK: {
      const { stop, route, destination } = action
      if (!stop || !route || !destination) {
        throw new TypeError('`stop`, `route`, and `destination` are required')
      }
      const { transitBookmarks } = state
      const newBookmark = { stop, route, destination }
      const nextTransitBookmarks = [ ...transitBookmarks ]
      if (!transitBookmarks.find((bookmark) => { return isEqual(bookmark, newBookmark) })) {
        nextTransitBookmarks.push(newBookmark)
      }

      return {
        ...state,
        transitBookmarks: nextTransitBookmarks
      }
    }

    case REMOVE_TRANSIT_BOOKMARK: {
      const { stop, route, destination } = action
      if (!stop || !route || !destination) {
        throw new TypeError('`stop`, `route`, and `destination` are required')
      }
      const { transitBookmarks } = state
      const toRemove = { stop, route, destination }
      const nextTransitBookmarks = transitBookmarks.filter(bookmark => !isEqual(bookmark, toRemove))

      return {
        ...state,
        transitBookmarks: nextTransitBookmarks
      }
    }

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
