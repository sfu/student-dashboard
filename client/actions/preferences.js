import axios from 'axios'

export const SYNC_PREFERENCES_START = 'SYNC_PREFERENCES_START'
export const SYNC_PREFERENCES_SUCCESS = 'SYNC_PREFERENCES_SUCCESS'
export const SYNC_PREFERENCES_ERROR = 'SYNC_PREFERENCES_ERROR'
export const SET_PREFERENCES = 'SET_PREFERENCES'

const PREFERENCES_URL = '/api/v1/users/self/preferences'

export const setPreferences = preferences => {
  return {
    type: SET_PREFERENCES,
    preferences
  }
}

export const syncPreferencesStart = () => {
  return {
    type: SYNC_PREFERENCES_START
  }
}

export const syncPreferencesSuccess = () => {
  return {
    type: SYNC_PREFERENCES_SUCCESS
  }
}

export const syncPreferencesError = error => {
  return {
    type: SYNC_PREFERENCES_ERROR,
    error
  }
}

export const updatePreference = (key, value) => {
  return (dispatch, getState) => {
    const currentPreferences = getState().preferences.preferenceData
    // optimistic update
    dispatch(setPreferences([...currentPreferences, {key, value}]))
    dispatch(syncPreferencesStart())
    return axios({
      method: 'POST',
      url: PREFERENCES_URL,
      data: { key, value },
    }).then(() => {
      dispatch(syncPreferencesSuccess())
    }).catch(error => {
      // reset from optimistic update
      dispatch(setPreferences(currentPreferences))
      dispatch(syncPreferencesError(error.response.data))
    })
  }
}
