import {default as React, PropTypes} from 'react'
import { RoomFinderLink } from 'components/RoomFinderLink'
import DaysOfWeekIndicator from './DaysOfWeekIndicator.js'
import leftPad from 'utils/leftPad'
import moment from 'moment'

import styles from './MyCourses.css'

const ClassSchedule = ({schedule}) => {
  const { startTime, endTime, days, buildingCode, roomNumber } = schedule
  const start = {
    hour: leftPad(startTime, 4, 0).substr(0, 2),
    minute: leftPad(startTime, 4, 0).substr(2)
  }
  const end = {
    hour: leftPad(endTime, 4, 0).substr(0, 2),
    minute: leftPad(endTime, 4, 0).substr(2)
  }

  const startFormatted = moment().hour(start.hour).minute(start.minute).format('h:mm A')
  const endFormatted = moment().hour(end.hour).minute(end.minute).format('h:mm A')

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
      <span>{startFormatted} - {endFormatted}</span>
      {location(schedule)}
    </div>
  )
}

ClassSchedule.propTypes = {
  schedule: PropTypes.object.isRequired
}

export default ClassSchedule
