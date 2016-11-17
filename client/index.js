import 'babel-polyfill'
import './routerHotLoadPatch'
import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import { Provider } from 'react-redux'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import useRelay from 'react-router-relay'
import routes from './routes/routes'

// import {AppContainer} from 'react-hot-loader'
// import Renderer from './routes/router'

import { toggleHeaderNav } from 'actions/header'
import { fetchLibraryHours } from 'actions/library'
import configureStore from './configureStore'

const store = configureStore()

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

if (process.env.NODE_ENV !== 'production') {
  const RelayNetworkDebug = require('react-relay/lib/RelayNetworkDebug')
  RelayNetworkDebug.init()
}

browserHistory.listen(({pathname}) => {
  if (store.getState().header.showNav) {
    store.dispatch(toggleHeaderNav())
  }
  if (pathname === '/library') {
    store.dispatch(fetchLibraryHours())
  }
})


const RootElement = document.getElementById('sorry')
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
