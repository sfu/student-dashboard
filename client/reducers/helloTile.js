import { TOGGLE_HELLO_TILE } from '../actions/helloTile'

export const DEFAULT = {
  hide: false
}

export default (state = DEFAULT, action) => {
  switch (action.type) {
    case TOGGLE_HELLO_TILE:
      return {
        ...state,
        hide: !state.hide
      }
    default:
      return state
  }
}
