import 'babel-polyfill'

import React from 'react'
import Relay from 'react-relay'
import {render} from 'react-dom'
// import {Router, Route, browserHistory, applyRouteMiddleware} from 'react-router'
// import useRelay from 'react-router-relay'
import Renderer from './renderer'
import {AppContainer} from 'react-hot-loader'

const RootElement = document.getElementById('sorry')
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

render(
  <AppContainer>
    {Renderer}
  </AppContainer>,
RootElement)

if (module.hot) {
  module.hot.accept('./renderer', () => {
    const NextRootContainer = require('./renderer').default
    render(
      <AppContainer>
         {NextRootContainer}
      </AppContainer>,
      RootElement
    )
  })
}
