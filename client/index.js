import 'babel-polyfill'
import './routerHotLoadPatch'
import Relay from 'react-relay'
import React from 'react'
// import {AppContainer} from 'react-hot-loader'
import ReactDOM from 'react-dom'
// import Renderer from './routes/router'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import useRelay from 'react-router-relay'
import routes from './routes/routes'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { header, library } from './reducers'
import { toggleHeaderNav } from 'actions/header'
import { fetchLibraryHours } from 'actions/library'

const store = createStore(
  combineReducers({ header, library }),
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
)

const RootElement = document.getElementById('sorry')

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

if (process.env.NODE_ENV !== 'production') {
  const RelayNetworkDebug = require('react-relay/lib/RelayNetworkDebug')
  RelayNetworkDebug.init()
}

browserHistory.listen(() => {
  if (store.getState().header.showNav) {
    store.dispatch({ type: 'TOGGLE_HEADER_NAV' })
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      render={applyRouterMiddleware(useRelay)}
      environment={Relay.Store}
      routes={routes}
    />
  </Provider>,
  RootElement
)
























//
// const render = () => {
//   ReactDOM.render(<AppContainer>{Renderer}</AppContainer>, RootElement)
// }
//
// render()
//
// if (module.hot) {
//   module.hot.accept('./routes/router', () => {
//     const NextRootContainer = require('./routes/router').default
//     render(
//       <AppContainer>
//          {NextRootContainer}
//       </AppContainer>,
//       RootElement
//     )
//   })
// }
