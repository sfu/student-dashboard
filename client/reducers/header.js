export default (state = { showNav: false }, action) => {
  switch (action.type) {
    case 'TOGGLE_HEADER_NAV':
      return {
        ...state,
        showNav: !state.showNav
      }
    default:
      return state
  }
}
