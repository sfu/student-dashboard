import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'

const widgetStyle = {
  border: '1px solid #A6192E',
  padding: '5px',
  marginBottom: '10px'
}


const UserBio = React.createClass({
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

export default Relay.createContainer(UserBio, {
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
