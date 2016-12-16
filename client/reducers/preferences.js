import {
  SYNC_PREFERENCES_START,
  SYNC_PREFERENCES_SUCCESS,
  SYNC_PREFERENCES_ERROR,
  SET_PREFERENCES
} from '../actions/preferences'

const BOOTSTRAP = (window && window.STATE_BOOTSTRAP && window.STATE_BOOTSTRAP.preferences) || {}

export const DEFAULT = {
  syncingPreferences: false,
  syncPreferencesError: null,
  preferenceData: {
    timeFormat: '12h',
    ...BOOTSTRAP
  }
}

export default (state = DEFAULT, action) => {
  const { type } = action
  switch (type) {
    case SYNC_PREFERENCES_START:
      return {
        ...state,
        syncingPreferences: true,
        syncPreferencesError: null
      }

    case SYNC_PREFERENCES_SUCCESS:
      return {
        ...state,
        syncingPreferences: false,
        syncPreferencesError: null
      }

    case SYNC_PREFERENCES_ERROR:
      return {
        ...state,
        syncingPreferences: false,
        syncPreferencesError: action.error
      }

    case SET_PREFERENCES:
      return {
        ...state,
        syncingPreferences: false,
        syncPreferencesError: null,
        preferenceData: action.preferences
      }

    default:
      return state
  }
}
