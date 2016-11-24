import axios from 'axios'

export const FETCH_STOPS = 'FETCH_STOPS'
export const FETCH_STOPS_START = 'FETCH_STOPS_START'
export const FETCH_STOPS_SUCCESS = 'FETCH_STOPS_SUCCESS'
export const FETCH_STOPS_ERROR = 'FETCH_STOPS_ERROR'
export const TOGGLE_CURRENT_LOCATION_ON_MAP = 'TOGGLE_CURRENT_LOCATION_ON_MAP'

export const fetchStops = (coords, radius = 600) => {
  return (dispatch) => {
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

export const toggleCurrentLocationOnMap = () => ({ type: TOGGLE_CURRENT_LOCATION_ON_MAP })
