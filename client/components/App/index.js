import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import UserBio from '../UserBio'
import CampusConditions from '../CampusConditions'

const appStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
}

const App = ({viewer}) => {
  return (
  <div style={appStyle}>
    <h1>SFU SNAP</h1>
    <UserBio userBio={viewer.userBio} />
    <CampusConditions conditions={viewer.campusConditions} />
  </div>
  )
}

App.propTypes = {
  viewer: PropTypes.object
}

export default Relay.createContainer(App, {
  initialVariables: {
    userid: window.ENV.CURRENT_USER.username
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on ViewerType {
        userBio(userid: $userid) {
          ${UserBio.getFragment('userBio')}
        }
        campusConditions {
          ${CampusConditions.getFragment('conditions')}
        }
      }
    `
  }
})
