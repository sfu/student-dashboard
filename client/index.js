import 'babel-polyfill'
import './routerHotLoadPatch'
import Relay from 'react-relay'
import React from 'react'
import {AppContainer} from 'react-hot-loader'
import ReactDOM from 'react-dom'
import Renderer from './renderer'

const RootElement = document.getElementById('sorry')

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

const render = () => {
  ReactDOM.render(<AppContainer>{Renderer}</AppContainer>, RootElement)
}

render()

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
