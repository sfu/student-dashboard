import axios from 'axios'

export const FETCH_STOPS = 'FETCH_STOPS'
export const FETCH_STOPS_START = 'FETCH_STOPS_START'
export const FETCH_STOPS_SUCCESS = 'FETCH_STOPS_SUCCESS'
export const FETCH_STOPS_ERROR = 'FETCH_STOPS_ERROR'
export const TOGGLE_CURRENT_LOCATION_ON_MAP = 'TOGGLE_CURRENT_LOCATION_ON_MAP'
export const SET_SELECTED_STOP = 'SET_SELECTED_STOP'

export const fetchStops = (coords, radius = 600) => {
  return (dispatch) => {
export const FETCH_SCHEDULE_FOR_BUS_STOP_START = 'FETCH_SCHEDULE_FOR_BUS_STOP_START'
export const FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS = 'FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS'
export const FETCH_SCHEDULE_FOR_BUS_STOP_ERROR = 'FETCH_SCHEDULE_FOR_BUS_STOP_ERROR'
export const FETCH_SCHEDULE_FOR_BUS_STOP = 'FETCH_SCHEDULE_FOR_BUS_STOP'

    dispatch(fetchStopsStart())
    const latitude = parseFloat(coords.latitude).toFixed(5)
    const longitude =  parseFloat(coords.longitude).toFixed(5)
    const STOPS_URL = `/translink/stops?lat=${latitude}&long=${longitude}&radius=${radius}`
    return axios.get(STOPS_URL).then((response) => {
      dispatch(fetchStopsSuccess(response.data))
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

export const toggleCurrentLocationOnMap = () => ({ type: TOGGLE_CURRENT_LOCATION_ON_MAP })
export const fetchSchedulesForBusStop = (stop) => {
  return (dispatch) => {
    dispatch(fetchSchedulesForBusStopStart())
    const SCHEDULES_URL = `/translink/stops/${stop}/estimates?count=3`
    return axios.get(SCHEDULES_URL).then((response) => {
      dispatch(fetchSchedulesForBusStopSuccess(response.data))
    }).catch((error) => {
      dispatch(fetchSchedulesForBusStopError(error))
    })
  }
}

export const fetchSchedulesForBusStopStart = () => ({ type: FETCH_SCHEDULE_FOR_BUS_STOP_START })

export const fetchSchedulesForBusStopSuccess = (schedules) => {
  return {
    type: FETCH_SCHEDULE_FOR_BUS_STOP_SUCCESS,
    schedulesForSelectedStop: schedules
  }
}

export const fetchSchedulesForBusStopError = (error) => {
  return {
    type: FETCH_SCHEDULE_FOR_BUS_STOP_ERROR,
    error
  }
}
