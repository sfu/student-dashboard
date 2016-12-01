export const GET_PREFERENCES = 'GET_PREFERENCES'
export const GET_PREFERENCE = 'GET_PREFERENCE'
export const SET_PREFERENCE = 'SET_PREFERENCE'
export const ADD_TRANSIT_BOOKMARK = 'ADD_TRANSIT_BOOKMARK'
export const REMOVE_TRANSIT_BOOKMARK = 'REMOVE_TRANSIT_BOOKMARK'

export const getPreferences = () => ({ type: GET_PREFERENCES })

export const setPreference = (preference, value) => {
  return {
    type: SET_PREFERENCE,
    preference,
    value
  }
}

export const addTransitBookmark = (stop, route, destination) => {
  return {
    type: ADD_TRANSIT_BOOKMARK,
    stop: stop.toString(),
    route: route.toString(),
    destination
  }
}

export const removeTransitBookmark = (stop, route, destination) => {
  return {
    type: REMOVE_TRANSIT_BOOKMARK,
    stop: stop.toString(),
    route: route.toString(),
    destination
  }
}
