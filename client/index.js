import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {render} from 'react-dom'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)

class UserBio extends React.Component {
  render() {
    const {lastname, firstnames, commonname, username, sfuid} = this.props.store
    return (
      <div>
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
}

UserBio.propTypes = {
  store: PropTypes.object.isRequired
}

const UserBioContainer = Relay.createContainer(UserBio, {
  fragments: {
    store: () => Relay.QL`
      fragment on UserBioType {
          username,
          barcode,
          firstnames,
          commonname,
          lastname,
          sfuid,
          id
      }
    `
  }
})

class UserBioRoute extends Relay.Route {
  static routeName = 'UserBioRoute'
  static queries = {
  store: ((Component) => {
    return Relay.QL`
    query root {
      userBio(userid: $userid) { ${Component.getFragment('store')} }
    }
  `}),
};

}


const RootComponent = <Relay.RootContainer Component={UserBioContainer} route={new UserBioRoute({userid: window.ENV.CURRENT_USER.username})} />
render(RootComponent, document.getElementById('app'))
