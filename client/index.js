import 'babel-polyfill'
import './routerHotLoadPatch'
import Relay from 'react-relay'
import React from 'react'
import {AppContainer} from 'react-hot-loader'
import ReactDOM from 'react-dom'
import Renderer from './routes/router'

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

const render = () => {
  ReactDOM.render(<AppContainer>{Renderer}</AppContainer>, RootElement)
}

render()

if (module.hot) {
  module.hot.accept('./routes/router', () => {
    const NextRootContainer = require('./routes/router').default
    render(
      <AppContainer>
         {NextRootContainer}
      </AppContainer>,
      RootElement
    )
  })
}
