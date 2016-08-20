import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'


const widgetStyle = {
  border: '1px solid #A6192E',
  padding: '5px',
  marginBottom: '10px'
}

const CampusConditions = React.createClass({
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

export default Relay.createContainer(CampusConditions, {
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
