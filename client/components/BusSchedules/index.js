import React, { PropTypes } from 'react'
import BusScheduleRow from 'components/BusScheduleRow'
import transformTranslinkText from 'utils/transformTranslinkText'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import formatTime from 'utils/formatTime'
import { fetchSchedulesForBusStop } from 'actions/transit'
import styles from './BusSchedules.css'

const mapStateToProps = state => ({ transit: state.transit })

const scheduleRows = (schedules) => {
  return schedules.map((schedule, i) => <BusScheduleRow busNumber={schedule.RouteNo} schedules={schedule} key={i} />)
}

const BusSchedules = ({transit, selectedStop, schedules, dispatch}) => {
  const refresh = stop => {
    dispatch(fetchSchedulesForBusStop(stop))
  }

  const stopName = `${transformTranslinkText(selectedStop.OnStreet)} / ${transformTranslinkText(selectedStop.AtStreet)}`
  return (
    <div>
      <div className={styles.stopInfoHeader}>
        <h2 className={styles.stopName}>{stopName}</h2>
        <h3 className={styles.stopNumber}>#{selectedStop.StopNo}</h3>
      </div>
      <div className={styles.schedules}>
        {transit.fetchingSchedules && <Loading title='Checking Schedules' />}
        {
          transit.schedulesFetchedAt &&
          <div className={styles.scheduleControls}>
            <p className={styles.fetchedAt}>
              Prediction as of {formatTime(transit.schedulesFetchedAt)}
            </p>
            <button className={styles.refreshButton} onClick={() => {refresh(selectedStop.StopNo)}}>Refresh</button>
          </div>

        }
        {scheduleRows(schedules)}
      </div>
    </div>
  )
}

BusSchedules.propTypes = {
  selectedStop: PropTypes.object.isRequired,
  schedules: PropTypes.array.isRequired,
  transit: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(BusSchedules)
