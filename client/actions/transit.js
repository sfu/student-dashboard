import axios from 'axios'
import uniqBy from 'lodash/uniqBy'
import normalizeTranslinkData from 'utils/normalizeTranslinkData'

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


export const fetchStop = (stop) => {
  return (dispatch, getState) => {
    dispatch(fetchStopsStart())
    const STOP_URL = `/translink/stops/${stop}`
    return axios.get(STOP_URL).then((response) => {
      const newStop = response.data
      const nextState = uniqBy(getState().transit.stops.concat(newStop), 'StopNo')
      dispatch(fetchStopsSuccess(nextState))
    }).catch((error) => {
      dispatch(fetchStopsError(error))
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
      dispatch(fetchStopsError(error))
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
