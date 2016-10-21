import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {Widget} from 'components/Widget'
import {HelloTile} from 'components/HelloTile'
import {WeekAtAGlance} from 'components/WeekAtAGlance'

const _Dashboard = ({viewer, location: { query }}) => {
  return (
    <div>
      <HelloTile helloTileSchedule={viewer} names={viewer} />
      <Widget title="My Week at a Glance">
        <WeekAtAGlance schedule={viewer} start_at={query.start_at} />
      </Widget>
    </div>
  )
}

_Dashboard.propTypes = {
  viewer: PropTypes.object,
  location: PropTypes.object
}

export const Dashboard = Relay.createContainer(_Dashboard, {
  fragments: {
    viewer: () => Relay.QL`
      fragment viewer on ViewerType {
        ${HelloTile.getFragment('names')}
        ${HelloTile.getFragment('helloTileSchedule')}
        ${WeekAtAGlance.getFragment('schedule')}
      }
    `
  }
})
