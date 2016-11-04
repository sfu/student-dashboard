import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {Widget} from 'components/Widget'
import Pageable from 'components/Pageable'
import {HelloTile} from 'components/HelloTile'
import {WeekAtAGlance} from 'components/WeekAtAGlance'
import moment from 'moment'

const _Dashboard = ({viewer, location: { query }}) => {
  const { start_at } = query
  const today = moment().day()
  const selectedDay = !isNaN(start_at) && (start_at >= 0 && start_at <= 6) ? parseInt(start_at) : today
  return (
    <div>
      <HelloTile helloTileSchedule={viewer} names={viewer} />
      <Widget title="My Week at a Glance">
        <Pageable
          pagerTitles={[...Array(7).keys()].map(d => d === today ? 'Today' : moment().day(d).format('dddd, MMMM DD'))}
          pageCount={7}
          startAtPage={selectedDay}
        >
          <WeekAtAGlance schedule={viewer} selectedDay={selectedDay} />
        </Pageable>
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
