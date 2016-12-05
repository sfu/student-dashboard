export const GET_PREFERENCES = 'GET_PREFERENCES'
export const SET_PREFERENCE = 'SET_PREFERENCE'

export const getPreferences = () => ({ type: GET_PREFERENCES })

export const setPreference = (preference, value) => {
  return {
    type: SET_PREFERENCE,
    preference,
    value
  }
}
