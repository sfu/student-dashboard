import {default as React, PropTypes} from 'react'
import { RoomFinderLink } from 'components/RoomFinderLink'
import formatTimeRange from 'utils/formatTimeRange'
import { REST_TO_ABBR_DAYS_MAP } from 'const'

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

  const startMoment = moment().hour(start.hour).minute(start.minute)
  const endMoment = moment().hour(end.hour).minute(end.minute)

  const location = (schedule) => {
    const location = schedule.campus.toLowerCase() === 'burnaby' ?
      <RoomFinderLink building={buildingCode} room={roomNumber} /> :
      <span>{schedule.buildingCode} {schedule.roomNumber}</span>

    return (
      <span className={styles.classLocation}>
        {location}
      </span>
    )
  }

  const classDays = days.split('').map(day => REST_TO_ABBR_DAYS_MAP[day]).join(', ')

  return (
    <div className={styles.classSchedule}>
      <span className={styles.classDays}>{classDays}</span>
      <span className={styles.classTimes}>{formatTimeRange(startMoment, endMoment)}</span>
      {location(schedule)}
    </div>
  )
}

ClassSchedule.propTypes = {
  schedule: PropTypes.object.isRequired
}

export default ClassSchedule
