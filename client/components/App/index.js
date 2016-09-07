import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {Header} from 'components/Header'
import {Widget} from 'components/Widget'
import {HelloTile} from 'components/HelloTile'
import {WeekAtAGlance} from 'components/WeekAtAGlance'
import 'normalize.css/normalize.css'
import 'styles/global.css'
import styles from './App.css'

// temp
import weekAtAGlanceData from '../../../tmp/weekataglance'

export const _App = ({viewer}) => {
  return (
  <div className={styles.app}>
    <Header />
    <div className={styles.widgets}>
      <HelloTile schedule={weekAtAGlanceData} names={viewer.names} />
      <Widget title="My Week at a Glance">
        <WeekAtAGlance schedule={weekAtAGlanceData} />
      </Widget>
    </div>
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
        names:userBio(userid: $userid) {
          ${HelloTile.getFragment('names')}
        }
      }
    `
  }
})
