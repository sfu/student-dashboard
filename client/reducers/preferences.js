import {
  GET_PREFERENCES,
  SET_PREFERENCE
} from '../actions/preferences'

export const DEFAULT = {
  timeFormat: '12h'
}

export default (state = DEFAULT, action) => {
  const { type } = action
  switch (type) {
    case GET_PREFERENCES:
      return state

    case SET_PREFERENCE: {
      const { preference, value } = action

      return {
        ...state,
        [preference]: value
      }
    }

    default:
      return state
  }
}
