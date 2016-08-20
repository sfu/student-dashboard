import React from 'react'
import Relay from 'react-relay'
import {render} from 'react-dom'
import App from './components/App'


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

const queries = {
  name: 'AppQueries',
  params: {},
  queries: {
    viewer: () => Relay.QL`
      query {
        viewer
      }
    `
  }
}

const RootComponent = (<Relay.RootContainer
                        Component={App}
                        route={queries}
                      />)
render(RootComponent, document.getElementById('sorry'))
