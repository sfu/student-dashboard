import ReactGA from 'react-ga'
export const TOGGLE_HEADER_NAV = 'TOGGLE_HEADER_NAV'

export const toggleHeaderNav = () => {
  return (dispatch, getState) => {
    dispatch({
      type: TOGGLE_HEADER_NAV,
    })
    ReactGA.event({
      category: 'Header',
      action: TOGGLE_HEADER_NAV,
      label: getState().header.showNav ? 'close' : 'open'
    })
  }
}
