import isEqual from 'lodash/isEqual'
import {
  GET_PREFERENCES,
  SET_PREFERENCE,
  ADD_TRANSIT_BOOKMARK,
  REMOVE_TRANSIT_BOOKMARK
} from '../actions/preferences'

export const DEFAULT = {
  timeFormat: '12h',
  transitBookmarks: []
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
      const { stop, route, destination } = action
      if (!stop || !route || !destination) {
        throw new TypeError('`stop`, `route`, and `destination` are required')
      }
      const { transitBookmarks } = state
      const newBookmark = { stop, route, destination }
      const nextTransitBookmarks = [ ...transitBookmarks ]
      if (!transitBookmarks.find((bookmark) => { return isEqual(bookmark, newBookmark) })) {
        nextTransitBookmarks.push(newBookmark)
      }

      return {
        ...state,
        transitBookmarks: nextTransitBookmarks
      }
    }

    case REMOVE_TRANSIT_BOOKMARK: {
      const { stop, route, destination } = action
      if (!stop || !route || !destination) {
        throw new TypeError('`stop`, `route`, and `destination` are required')
      }
      const { transitBookmarks } = state
      const toRemove = { stop, route, destination }
      const nextTransitBookmarks = transitBookmarks.filter(bookmark => !isEqual(bookmark, toRemove))

      return {
        ...state,
        transitBookmarks: nextTransitBookmarks
      }
    }

    default:
      return state
  }
}
