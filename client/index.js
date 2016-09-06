import 'babel-polyfill'

import React from 'react'
import Relay from 'react-relay'
import {render} from 'react-dom'
import {RootContainer} from './containers/RootContainer'
import {AppContainer} from 'react-hot-loader'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

const RootElement = document.getElementById('sorry')

render(
  <AppContainer>
    {RootContainer}
  </AppContainer>,
RootElement)


if (module.hot) {
  module.hot.accept('./containers/RootContainer', () => {
    const NextRootContainer = require('./containers/RootContainer').RootContainer
    render(
      <AppContainer>
         {NextRootContainer}
      </AppContainer>,
      RootElement
    )
  })
}
