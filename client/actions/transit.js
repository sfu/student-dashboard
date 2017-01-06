import axios from 'axios'
import uniqBy from 'lodash/uniqBy'
import isEqual from 'lodash/isEqual'
import ReactGA from 'react-ga'
import normalizeTranslinkData from '../utils/normalizeTranslinkData'

export const ADD_TRANSIT_BOOKMARK = 'ADD_TRANSIT_BOOKMARK'
export const REMOVE_TRANSIT_BOOKMARK = 'REMOVE_TRANSIT_BOOKMARK'

export const SYNC_TRANSIT_BOOKMARK_START = 'SYNC_TRANSIT_BOOKMARK_START'
export const SYNC_TRANSIT_BOOKMARK_SUCCESS = 'SYNC_TRANSIT_BOOKMARK_SUCCESS'
export const SYNC_TRANSIT_BOOKMARK_ERROR = 'SYNC_TRANSIT_BOOKMARK_ERROR'
export const SET_TRANSIT_BOOKMARKS = 'SET_TRANSIT_BOOKMARKS'

export const FETCH_STOPS = 'FETCH_STOPS'
export const FETCH_STOPS_START = 'FETCH_STOPS_START'
export const FETCH_STOPS_SUCCESS = 'FETCH_STOPS_SUCCESS'
export const FETCH_STOPS_ERROR = 'FETCH_STOPS_ERROR'

export const UPDATE_MAP_CENTER = 'UPDATE_MAP_CENTER'
export const UPDATE_MAP_ZOOM = 'UPDATE_MAP_ZOOM'
export const SHOW_CURRENT_LOCATION_ON_MAP = 'SHOW_CURRENT_LOCATION_ON_MAP'
export const LOCATE_ON_MOUNT = 'LOCATE_ON_MOUNT'

export const SET_SELECTED_STOP = 'SET_SELECTED_STOP'

export const FETCH_SCHEDULE_FOR_BUS_STOP_START = 'FETCH_SCHEDULE_FOR_BUS_STOP_START'
export const FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS = 'FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS'
export const FETCH_SCHEDULE_FOR_BUS_STOP_ERROR = 'FETCH_SCHEDULE_FOR_BUS_STOP_ERROR'
export const FETCH_SCHEDULE_FOR_BUS_STOP = 'FETCH_SCHEDULE_FOR_BUS_STOP'

export const FETCH_SCHEDULES_FOR_BOOKMARKS_START = 'FETCH_SCHEDULES_FOR_BOOKMARKS_START'
export const FETCH_SCHEDULES_FOR_BOOKMARKS_SUCCESS = 'FETCH_SCHEDULES_FOR_BOOKMARKS_SUCCESS'
export const FETCH_SCHEDULES_FOR_BOOKMARKS_ERROR = 'FETCH_SCHEDULES_FOR_BOOKMARKS_ERROR'
export const FETCH_SCHEDULES_FOR_BOOKMARKS = 'FETCH_SCHEDULES_FOR_BOOKMARKS'

export const SEARCH_FOR_STOP_START = 'SEARCH_FOR_STOP_START'
export const SEARCH_FOR_STOP_SUCCESS = 'SEARCH_FOR_STOP_START'
export const SEARCH_FOR_STOP_ERROR = 'SEARCH_FOR_STOP_ERROR'
export const SEARCH_FOR_STOP_UPDATE_FIELD_VALUE = 'SEARCH_FOR_STOP_UPDATE_FIELD_VALUE'


const BOOKMARKS_URL = '/api/v1/users/self/transitBookmarks'

export const setTransitBookmarks = bookmarks => {
  return {
    type: SET_TRANSIT_BOOKMARKS,
    bookmarks
  }
}

export const syncTransitBookmarkStart = () => {
  return {
    type: SYNC_TRANSIT_BOOKMARK_START
  }
}

export const syncTransitBookmarkSuccess = () => {
  return {
    type: SYNC_TRANSIT_BOOKMARK_SUCCESS
  }
}

export const syncTransitBookmarkError = error => {
  return {
    type: SYNC_TRANSIT_BOOKMARK_ERROR,
    error
  }
}

export const addTransitBookmark = bookmark => {
  return (dispatch, getState) => {
    const currentBookmarks = getState().transit.transitBookmarks
    // optimistic update
    dispatch(setTransitBookmarks([...currentBookmarks, bookmark]))
    dispatch(syncTransitBookmarkStart())
    return axios({
      method: 'POST',
      url: BOOKMARKS_URL,
      data: bookmark,
    }).then(() => {
      dispatch(syncTransitBookmarkSuccess())
      ReactGA.event({
        category: 'Transit',
        action: ADD_TRANSIT_BOOKMARK,
        label: bookmark.stop
      })
    }).catch(error => {
      // reset from optimistic update
      dispatch(setTransitBookmarks(currentBookmarks))
      dispatch(syncTransitBookmarkError(error.response.data))
    })
  }
}

export const removeTransitBookmark = bookmark => {
  return (dispatch, getState) => {
    const currentBookmarks = getState().transit.transitBookmarks
    // optimistic update
    const nextBookmarks = currentBookmarks.filter(b => !isEqual(b, bookmark))
    dispatch(setTransitBookmarks(nextBookmarks))
    dispatch(syncTransitBookmarkStart())
    return axios({
      method: 'DELETE',
      url: BOOKMARKS_URL,
      data: bookmark,
    }).then(() => {
      dispatch(syncTransitBookmarkSuccess())
      ReactGA.event({
        category: 'Transit',
        action: REMOVE_TRANSIT_BOOKMARK,
        label: bookmark.stop
      })
    }).catch(error => {
      // reset from optimistic update
      dispatch(setTransitBookmarks(currentBookmarks))
      dispatch(syncTransitBookmarkError(error.response.data))
    })
  }
}

export const fetchStop = (stop) => {
  return (dispatch, getState) => {
    dispatch(fetchStopsStart())
    const STOP_URL = `/translink/stops/${stop}`
    return axios.get(STOP_URL).then((response) => {
      const newStop = response.data
      const nextState = uniqBy(getState().transit.stops.concat(newStop), 'StopNo')
      dispatch(fetchStopsSuccess(nextState))
    }).catch((error) => {
      dispatch(fetchStopsError(error.response.data))
    })
  }
}

export const fetchStops = (coords, radius) => {
  return (dispatch, getState) => {
    dispatch(fetchStopsStart())
    const latitude = parseFloat(coords.latitude).toFixed(5)
    const longitude =  parseFloat(coords.longitude).toFixed(5)
    const STOPS_URL = `/translink/stops?lat=${latitude}&long=${longitude}&radius=${radius}`
    return axios.get(STOPS_URL).then((response) => {
      const nextState = uniqBy(getState().transit.stops.concat(response.data), 'StopNo')
      dispatch(fetchStopsSuccess(nextState))
    }).catch((error) => {
      dispatch(fetchStopsError(error.response.data))
    })
  }
}

export const fetchStopsStart = () => {
  return {
    type: FETCH_STOPS_START
  }
}

export const fetchStopsSuccess = (stops) => {
  return {
    type: FETCH_STOPS_SUCCESS,
    stops
  }
}

export const fetchStopsError = (error) => {
  return {
    type: FETCH_STOPS_ERROR,
    error
  }
}

export const setSelectedStop = stop => {
  return {
    type: SET_SELECTED_STOP,
    stop
  }
}

export const fetchSchedulesForBusStop = (stop) => {
  return (dispatch) => {
    dispatch(fetchSchedulesForBusStopStart())
    const SCHEDULES_URL = `/translink/stops/${stop}/estimates`
    return axios.get(SCHEDULES_URL).then((response) => {
      dispatch(fetchSchedulesForBusStopSuccess(normalizeTranslinkData(response.data)))
    }).catch((error) => {
      dispatch(fetchSchedulesForBusStopError(error.response.data))
    })
  }
}

export const fetchSchedulesForBusStopStart = () => ({ type: FETCH_SCHEDULE_FOR_BUS_STOP_START })

export const fetchSchedulesForBusStopSuccess = (schedules) => {
  return {
    type: FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS,
    schedulesForSelectedStop: schedules,
    fetchedAt: Date.now()
  }
}

export const fetchSchedulesForBusStopError = (error) => {
  return {
    type: FETCH_SCHEDULE_FOR_BUS_STOP_ERROR,
    error
  }
}

export const updateMapCenter = mapCenter => {
  return {
    type: UPDATE_MAP_CENTER,
    mapCenter
  }
}

export const updateMapZoom = mapZoom => {
  return {
    type: UPDATE_MAP_ZOOM,
    mapZoom
  }
}

export const toggleLocateOnMount = (locateOnMount = false) => {
  return {
    type: LOCATE_ON_MOUNT,
    locateOnMount
  }
}

export const toggleCurrentLocationOnMap = (state = false) => {
  return {
    type: SHOW_CURRENT_LOCATION_ON_MAP,
    showCurrentLocationOnMap: state
  }
}

export const fetchSchedulesForBookmarks = () => {
  return dispatch => {
    dispatch(fetchSchedulesForBookmarksStart())
    const url = '/api/v1/users/self/transitBookmarks/estimates'
    return axios.get(url).then(response => {
      dispatch(fetchSchedulesForBookmarksSuccess(response.data))
    }).catch(error => {
      dispatch(fetchSchedulesForBookmarksError(error.response.data))
    })
  }
}

export const fetchSchedulesForBookmarksStart = () => {
  return {
    type: FETCH_SCHEDULES_FOR_BOOKMARKS_START
  }
}

export const fetchSchedulesForBookmarksSuccess = schedules => {
  return {
    type: FETCH_SCHEDULES_FOR_BOOKMARKS_SUCCESS,
    schedules,
    transitBookmarksSchedulesFetchedAt: Date.now()
  }

}
export const fetchSchedulesForBookmarksError = error => {
  return {
    type: FETCH_SCHEDULES_FOR_BOOKMARKS_ERROR,
    error
  }
}

export const searchForStopStart = () => {
  return {
    type: SEARCH_FOR_STOP_START
  }
}

export const searchForStopError = error => {
  return {
    type: SEARCH_FOR_STOP_ERROR,
    error
  }
}

export const searchForStopSuccess = stops => {
  return {
    type: SEARCH_FOR_STOP_SUCCESS,
    stops
  }
}

export const updateStopSearchFieldValue = value => {
  return {
    type: SEARCH_FOR_STOP_UPDATE_FIELD_VALUE,
    value
  }
}

export const searchForStop = (stop, router = undefined) => {
  ReactGA.event({
    category: 'Transit',
    action: 'SEARCH_FOR_STOP',
    label: stop
  })
  return (dispatch, getState) => {
    dispatch(searchForStopStart())
    const STOP_URL = `/translink/stops/${stop}`
    return axios.get(STOP_URL).then((response) => {
      const newStop = response.data
      const nextState = uniqBy(getState().transit.stops.concat(newStop), 'StopNo')
      dispatch(searchForStopSuccess(nextState))
      if (router) {
        router.push(`/transit/${stop}`)
      }
    }).catch((error) => {
      dispatch(searchForStopError(error.response.data))
    })
  }
}
