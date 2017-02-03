import ReactGA from 'react-ga'
export const TOGGLE_HELLO_TILE = 'TOGGLE_HELLO_TILE'

export const toggleHelloTile = () => {
  return (dispatch, getState) => {
    dispatch({
      type: TOGGLE_HELLO_TILE,
    })
    ReactGA.event({
      category: 'Header',
      action: TOGGLE_HELLO_TILE,
      label: getState().helloTile.hide ? 'hide' : 'show'
    })
  }
}
