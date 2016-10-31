import {default as React, PropTypes} from 'react'
import cx from 'classnames'
import {
  REST_SERVER_DAYS_OF_WEEK,
  CALENDAR_DAYS_OF_WEEK
} from 'const'
import styles from './MyCourses.css'

const DaysOfWeekIndicator = ({days}) => {
  const scheduleDays = days.split('')
  const dayEls = REST_SERVER_DAYS_OF_WEEK.map((d, i) => {
    const isActiveDay = scheduleDays.indexOf(d) >= 0
    const className = isActiveDay ? cx(styles.day, styles.activeDay) : styles.day
    return <span key={i} className={className}>{CALENDAR_DAYS_OF_WEEK[i]}</span>
  })
  return (
    <span>{dayEls}</span>
  )
}

DaysOfWeekIndicator.propTypes = {
  days: PropTypes.string.isRequired
}

export default DaysOfWeekIndicator
