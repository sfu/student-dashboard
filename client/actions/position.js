export const GET_POSITION_START = 'GET_POSITION_START'
export const GET_POSITION_SUCCESS = 'GET_POSITION_SUCCESS'
export const GET_POSITION_ERROR = 'GET_POSITION_ERROR'
export const GET_LOCATION = 'GET_LOCATION'

export const getPositionStart = () => ( { type: GET_POSITION_START} )

export const getPositionSuccess = (position) => ({
  type: GET_POSITION_SUCCESS,
  position
})

export const getPositionError = error => ({
  type: GET_POSITION_ERROR,
  error
})

export const getPosition = (options = { enableHighAccuracy: false, timeout: Infinity, maximumAge: 0 }) => {

  return dispatch => {
    if (typeof navigator === undefined || navigator && !navigator.geolocation) {
      dispatch(getPositionError(new Error('ERR_NO_GEOLOCATION')))
      return
    }

    dispatch(getPositionStart())

    navigator.geolocation.getCurrentPosition(
      (position) => { dispatch(position) },
      (error) => { dispatch(getPositionError(error)) },
      options
    )
  }
}
