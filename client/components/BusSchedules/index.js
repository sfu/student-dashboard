import React, { PropTypes } from 'react'
import BusScheduleRow from 'components/BusScheduleRow'
import transformTranslinkText from 'utils/transformTranslinkText'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import styles from './BusSchedules.css'

const mapStateToProps = state => ({ transit: state.transit })

const scheduleRows = (schedules) => {
  return schedules.map((schedule, i) => <BusScheduleRow busNumber={schedule.RouteNo} schedules={schedule} key={i} />)
}

const BusSchedules = ({transit, selectedStop, schedules}) => {
  const stopName = `${transformTranslinkText(selectedStop.OnStreet)} / ${transformTranslinkText(selectedStop.AtStreet)}`
  return (
    <div>
      <div className={styles.stopInfoHeader}>
        <h2 className={styles.stopName}>{stopName}</h2>
        <h3 className={styles.stopNumber}>#{selectedStop.StopNo}</h3>
      </div>
      <div className={styles.schedules}>
        {transit.fetchingSchedules && <Loading title='Checking Schedules' />}
        {scheduleRows(schedules)}
      </div>
    </div>
  )
}

BusSchedules.propTypes = {
  selectedStop: PropTypes.object.isRequired,
  schedules: PropTypes.array.isRequired,
  transit: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(BusSchedules)
