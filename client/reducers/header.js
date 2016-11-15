export default (state = { showNav: false }, action) => {
  console.log({state, action})
  switch (action.type) {
    case 'TOGGLE_HEADER_NAV':
      const nextState = {
        ...state,
        showNav: !state.showNav
      }
      console.log(nextState)
      return nextState
    default:
      return state
  }
}
