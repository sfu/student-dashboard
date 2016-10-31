import {default as React, PropTypes} from 'react'
import { RoomFinderLink } from 'components/RoomFinderLink'
import DaysOfWeekIndicator from './DaysOfWeekIndicator.js'

import styles from './MyCourses.css'

const ClassSchedule = ({schedule}) => {
  const { startTime, endTime, days, buildingCode, roomNumber } = schedule
  const location = (schedule) => {
    if (schedule.campus.toLowerCase() === 'burnaby') {
      return <RoomFinderLink building={buildingCode} room={roomNumber} />
    } else {
      return <span>{schedule.buildingCode} {schedule.roomNumber}</span>
    }
  }

  return (
    <div className={styles.classSchedule}>
      <DaysOfWeekIndicator days={days} />
      <span>{startTime} - {endTime}</span>
      {location(schedule)}
    </div>
  )
}

ClassSchedule.propTypes = {
  schedule: PropTypes.object.isRequired
}

export default ClassSchedule
