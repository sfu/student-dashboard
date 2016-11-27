import React, { PropTypes } from 'react'
import transformTranslinkText from 'utils/transformTranslinkText'
import BusIcon from '!url!./bus.svg'
import RealTimeIcon from '!url!./bus-waves.svg'
import styles from './BusScheduleRow.css'

const arrivalTimes = (schedules) => {
  const sorted = schedules.sort((a, b) => a.ExpectedCountdown > b.ExpectedCountdown)

  return sorted.slice(0,3).map((item, i) => {
    const { ScheduleStatus, ExpectedCountdown } = item
    const time =  ExpectedCountdown < 2 ? 'Now' : `${ExpectedCountdown} min`
    return (
      <li key={i} className={styles.arrivalTime}>
        {i === 0 && ScheduleStatus !== '*' ? <img alt="Real-time arrival estimate" className={styles.realTimeIcon} src={RealTimeIcon}/> : null}
        {time}
      </li>
    )
  })
}

const BusScheduleRow = ({ schedules }) => {
  return (
    <div className={styles.row}>
      <img src={BusIcon} alt="Bus Icon" className={styles.busIcon} />
      <div className={styles.routeInfo}>
        <h1 className={styles.routeNumber}>{schedules.RouteNo}</h1>
        <h2 className={styles.destination}>{transformTranslinkText(schedules.Schedules[0].Destination)}</h2>
      </div>
      <div className={styles.arrivalTimes}>
        <ul className={styles.arrivalTimesList}>
          {arrivalTimes(schedules.Schedules)}
        </ul>
      </div>
    </div>
  )
}

BusScheduleRow.propTypes = {
  schedules: PropTypes.object.isRequired
}

export default BusScheduleRow
