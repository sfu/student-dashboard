import React from 'react'
import Relay from 'react-relay'
import {App} from '../../components/App'

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
    renderLoading={() => <div>Loading&hellip;</div>}
    renderFailure={(error, retry) => { // eslint-disable-line
      return (
        <div>
          <p>{error.message}</p>
          <p><button onClick={retry}>Retry></button></p>
        </div>
      )
    }}
  />
)
