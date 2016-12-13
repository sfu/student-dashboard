import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import TransitMap from 'components/TransitMap'
import BusSchedules from 'components/BusSchedules'
import DashboardTransitBookmarks from 'components/DashboardTransitBookmarks'
import styles from './Transit.css'

const mapStateToProps = state => ({
  transit: state.transit
})

const Transit = ({transit}) => {
  return (
    <div>
      <TransitMap />
      {!transit.selectedStop && !!Object.keys(transit.transitBookmarksSchedules).length &&
        <div>
          <div className={styles.myBussesHeader}><h1 className={styles.myBusses}>My Busses</h1></div>
          <DashboardTransitBookmarks />
        </div>
      }
      {transit.selectedStop &&
        <BusSchedules
          selectedStop={transit.selectedStop}
          schedules={transit.schedulesForSelectedStop}
        />
      }
    </div>

  )
}

Transit.propTypes = {
  transit: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Transit)
