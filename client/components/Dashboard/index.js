import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'

import {Widget} from 'components/Widget'
import {HelloTile} from 'components/HelloTile'
import {WeekAtAGlance} from 'components/WeekAtAGlance'

// temp
import weekAtAGlanceData from '../../../tmp/weekataglance'

const _Dashboard = ({viewer}) => {
  return (
    <div>
      <HelloTile schedule={weekAtAGlanceData} names={viewer.names} />
      <Widget title="My Week at a Glance">
        <WeekAtAGlance schedule={weekAtAGlanceData} />
      </Widget>
    </div>
  )
}

_Dashboard.propTypes = {
  viewer: PropTypes.object
}

export const Dashboard = Relay.createContainer(_Dashboard, {
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
