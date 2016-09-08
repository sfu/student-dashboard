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

const renderer = (
  <Relay.Renderer
    Container={App}
    queryConfig={queries}
    environment={Relay.Store}
    render={
      ({error, props, retry}) => { // eslint-disable-line react/display-name
        if (error) {
          return (
            <Splash>
              <p>An error occurred feching your information.</p>
              <button onClick={retry}>Retry?</button>
              <a href="/auth/logout">Re-Login</a>
            </Splash>
          )
        } else if (props) {
          return <App {...props} />
        } else {
          return <Splash />
        }
      }
    }
  />
)

export default renderer
