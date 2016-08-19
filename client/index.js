import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {render} from 'react-dom'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

const widgetStyle = {
  border: '1px solid #A6192E',
  padding: '5px',
  marginBottom: '10px'
}

/////// CAMPUS CONDITIONS /////////
let CampusConditions = React.createClass({
  propTypes: {
    conditions: PropTypes.object.isRequired
  },

  render() {
    const {burnaby,surrey,vancouver} = this.props.conditions
    return (
      <div style={widgetStyle}>
      <h2>Campus Conditions</h2>
      <h3>Burnaby Campus:</h3>
      <ul>
        <li>Campus: <b>{burnaby.campus.status}</b></li>
        <li>Classes and Exams: <b>{burnaby.classesExams.status}</b></li>
      </ul>
      <h3>Surrey Campus:</h3>
      <ul>
        <li>Campus: <b>{surrey.campus.status}</b></li>
        <li>Classes and Exams: <b>{surrey.classesExams.status}</b></li>
      </ul>
      <h3>Vancouver Campus:</h3>
      <ul>
        <li>Campus: <b>{vancouver.campus.status}</b></li>
        <li>Classes and Exams: <b>{vancouver.classesExams.status}</b></li>
      </ul>

      </div>
    )
  }
})

const StatusFragment = Relay.QL`
  fragment StatusFields on CampusStatus {
    campus { status, severity }
    classesExams { status }
  }
`

CampusConditions = Relay.createContainer(CampusConditions, {
  fragments: {
    conditions: () => {
      return Relay.QL`
      fragment on CampusConditionsType {
        burnaby:conditions(location: "burnaby") {
          ${StatusFragment}
        }
        surrey:conditions(location: "surrey") {
          ${StatusFragment}
        }
        vancouver:conditions(location: "vancouver") {
          ${StatusFragment}
        }
      }
    `}
  }
})
// CampusConditions = Relay.createContainer(CampusConditions, {
//   fragments: {
//     conditions: () => {
//       return Relay.QL`
//       fragment StatusFields on CampusStatus {
//         campus{status}
//         classesExams{status}
//       }
//       fragment on CampusConditionsType {
//         campus1:conditions(location: "campus1") {
//           ...StatusFields
//         }
//         campus2:conditions(location: "campus2") {
//           ...StatusFields
//         }
//         campus3:conditions(location: "campus3") {
//           ...StatusFields
//         }
//       }
//     `}
//   }
// })




///////// USER BIO /////////
let UserBio = React.createClass({
  propTypes: {
    userBio: PropTypes.object.isRequired
  },

  render() {
    const {lastname, firstnames, commonname, username, sfuid} = this.props.userBio
    return (
      <div style={widgetStyle}>
        <h2>User Bio</h2>
        <ul>
          <li>Last Name: {lastname}</li>
          <li>First Names: {firstnames}</li>
          <li>Common Name: {commonname}</li>
          <li>Username: {username}</li>
          <li>SFU ID: {sfuid}</li>
        </ul>
      </div>
    )

  }
})

UserBio = Relay.createContainer(UserBio, {
  fragments: {
    userBio: () => Relay.QL`
      fragment on UserBioType {
        username,
        barcode,
        firstnames,
        commonname,
        lastname,
        sfuid,
        id
      }`
  }
})

///////// APP /////////

const appStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
}

let App = ({viewer}) => {
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

App = Relay.createContainer(App, {
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
