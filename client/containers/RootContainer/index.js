import React from 'react'
import Relay from 'react-relay'
import {App} from 'components/App'
import {Splash} from 'components/Splash'

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

export const RootContainer = (
  <Relay.RootContainer
    Component={App}
    route={queries}
    renderLoading={() => <Splash />}
    renderFailure={(error, retry) => { // eslint-disable-line
      return (
        <Splash>
          <p>An error occurred feching your information.</p>
          <button onClick={retry}>Retry?</button>
          <a href="/auth/logout">Re-Login</a>
        </Splash>
      )
    }}
  />
)
