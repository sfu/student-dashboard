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
      <HelloTile schedule={weekAtAGlanceData} names={viewer} />
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
  fragments: {
    viewer: () => Relay.QL`
      fragment viewer on ViewerType {
        ${HelloTile.getFragment('names')}
        ${WeekAtAGlance.getFragment('schedule')}
      }
    `
  }
})
