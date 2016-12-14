import {
  SYNC_TRANSIT_BOOKMARK_START,
  SYNC_TRANSIT_BOOKMARK_ERROR,
  SYNC_TRANSIT_BOOKMARK_SUCCESS,
  SET_TRANSIT_BOOKMARKS,
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
  FETCH_SCHEDULE_FOR_BUS_STOP_ERROR,
  FETCH_SCHEDULES_FOR_BOOKMARKS_START,
  FETCH_SCHEDULES_FOR_BOOKMARKS_SUCCESS,
  FETCH_SCHEDULES_FOR_BOOKMARKS_ERROR,
  SEARCH_FOR_STOP_START,
  SEARCH_FOR_STOP_SUCCESS,
  SEARCH_FOR_STOP_ERROR,
  SEARCH_FOR_STOP_UPDATE_FIELD_VALUE
} from '../actions/transit'
import L from 'leaflet'

export const DEFAULT = {
  /* bookmarks */
  transitBookmarks: (window && window.STATE_BOOTSTRAP && window.STATE_BOOTSTRAP.transitBookmarks) || [],
  syncingBookmarks: false,
  syncBookmarksError: null,
  transitBookmarksSchedules: {},
  transitBookmarksSchedulesFetchedAt: null,
  fetchingSchedulesForBookmarks: false,
  fetchSchedulesForBookmarksError: null,

  /* stop search */
  searchingForStop: false,
  searchForStopFieldValue: '',
  searchingForStopError: null,

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

    case SYNC_TRANSIT_BOOKMARK_START:
      return {
        ...state,
        syncingBookmarks: true,
        syncBookmarksError: null
      }

    case SYNC_TRANSIT_BOOKMARK_SUCCESS:
      return {
        ...state,
        syncingBookmarks: false,
        syncBookmarksError: null
      }

    case SYNC_TRANSIT_BOOKMARK_ERROR:
      return {
        ...state,
        syncingBookmarks: false,
        syncBookmarksError: action.error
      }

    case SET_TRANSIT_BOOKMARKS:
      return {
        ...state,
        syncingBookmarks: false,
        syncBookmarksError: null,
        transitBookmarks: action.bookmarks
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
    case FETCH_SCHEDULES_FOR_BOOKMARKS_START:
      return {
        ...state,
        fetchingSchedulesForBookmarks: true,
        fetchSchedulesForBookmarksError: null
      }
    case FETCH_SCHEDULES_FOR_BOOKMARKS_ERROR:
      return {
        ...state,
        fetchingSchedulesForBookmarks: false,
        fetchSchedulesForBookmarksError: action.error
      }
    case FETCH_SCHEDULES_FOR_BOOKMARKS_SUCCESS:
      return {
        ...state,
        fetchingSchedulesForBookmarks: false,
        fetchSchedulesForBookmarksError: null,
        transitBookmarksSchedules: action.schedules,
        transitBookmarksSchedulesFetchedAt: action.transitBookmarksSchedulesFetchedAt
      }
    case SEARCH_FOR_STOP_START:
      return {
        ...state,
        searchingForStop: true,
        searchingForStopError: null
      }
    case SEARCH_FOR_STOP_SUCCESS:
      return {
        ...state,
        searchingForStop: false,
        searchingForStopError: null,
        stops: action.stops
      }
    case SEARCH_FOR_STOP_ERROR:
      return {
        ...state,
        searchingForStop: false,
        searchingForStopError: action.error
      }
    case SEARCH_FOR_STOP_UPDATE_FIELD_VALUE:
      return {
        ...state,
        searchForStopFieldValue: action.value
      }
    default:
      return state
  }
}
