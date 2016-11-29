import {
  GET_PREFERENCES,
  SET_PREFERENCE,
  ADD_TRANSIT_BOOKMARK,
  REMOVE_TRANSIT_BOOKMARK
} from '../actions/preferences'

export const DEFAULT = {
  timeFormat: '12h',
  transitBookmarks: {}
}

export default (state = DEFAULT, action) => {
  const { type } = action
  switch (type) {
    case GET_PREFERENCES:
      return state

    case SET_PREFERENCE: {
      const { preference, value } = action
      if (preference === 'transitBookmarks') {
        throw new TypeError('Use ADD_BUS_STOP or REMOVE_BUS_STOP to modify transitBookmarks')
      }
      return {
        ...state,
        [preference]: value
      }
    }

    case ADD_TRANSIT_BOOKMARK: {
      const { stop, route } = action
      if (!stop || !route) {
        throw new TypeError('`stop` and `route` are required')
      }
      const { transitBookmarks } = state

      const nextTransitBookmarks = {
        ...transitBookmarks
      }

      if (Object.keys(nextTransitBookmarks).includes(stop)) {
        nextTransitBookmarks[stop] = Array.from(new Set([...nextTransitBookmarks[stop], route])).sort()
      } else {
        nextTransitBookmarks[stop] = [route]
      }

      return {
        ...state,
        transitBookmarks: nextTransitBookmarks
      }
    }

    case REMOVE_TRANSIT_BOOKMARK: {
      const { stop, route } = action
      if (!stop || !route) {
        throw new ReferenceError('`stop` and `route` are required')
      }
      const { transitBookmarks } = state
      const nextTransitBookmarks = {
        ...transitBookmarks
      }

      if (Object.keys(nextTransitBookmarks).includes(stop)) {
        nextTransitBookmarks[stop] = nextTransitBookmarks[stop].filter(r => r !== route)
        if (!nextTransitBookmarks[stop].length) {
          delete nextTransitBookmarks[stop]
        }
      }

      return {
        ...state,
        transitBookmarks: nextTransitBookmarks
      }
    }

    default:
      return state
  }
}
