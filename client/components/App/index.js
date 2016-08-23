import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {Header} from 'components/Header' // eslint-disable-line
import {UserBio} from 'components/UserBio'  // eslint-disable-line
import {CampusConditions} from 'components/CampusConditions'  // eslint-disable-line

const appStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
}

export const _App = ({viewer}) => {
  return (
  <div style={appStyle}>
    <Header />
    <UserBio userBio={viewer.userBio} />
    <CampusConditions conditions={viewer.campusConditions} />
  </div>
  )
}

_App.propTypes = {
  viewer: PropTypes.object
}

export const App = Relay.createContainer(_App, {
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
