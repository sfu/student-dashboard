import { TOGGLE_HEADER_NAV } from '../actions/header'

export const DEFAULT = {
  showNav: false
}

export default (state = DEFAULT, action) => {
  switch (action.type) {
    case TOGGLE_HEADER_NAV:
      return {
        ...state,
        showNav: !state.showNav
      }
    default:
      return state
  }
}
