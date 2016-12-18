import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import { TIME_SEPARATOR } from 'const/timeFormat'
import leftPad from 'utils/leftPad'

import styles from './LibraryHours.css'

const mapStateToProps = state => {
  return {
    hours: state.library.hours,
    timeFormat: state.preferences.preferenceData.timeFormat
  }
}

const formatLibraryHours = (str, format = '12h') => {
  const arr = str.trim().split(':')
  let hour = parseInt(arr[0])
  const minute = arr[1].substr(0,2)
  const meridiem = arr[1].substr(2,2)

  if (format === '24h') {
    if (meridiem === 'PM') {
      hour = hour + 12
    } else {
      hour = leftPad(hour,2, '0')
    }
    return `${hour}:${minute}`
  } else {
    return `${hour}:${minute} ${meridiem}`
  }
}

const LibraryHours = ({ hours, timeFormat }) => {

  const openHours = location => {
    return location.open_all_day ? 'Open 24 Hours' :
      `${formatLibraryHours(location.open_time, timeFormat)} ${TIME_SEPARATOR} ${formatLibraryHours(location.close_time, timeFormat)}`
  }

  return  (
    <div className={styles.libraryHours}>
      {
        hours.fetching  ? <p>Checking Libary Hours...</p> :
        <ul className={styles.libraryHoursList}>
          {hours.data.map((location, index) => (
            <li className={styles.libraryHoursListItem} key={index}>
              <div className={styles.col1}>
                <h3 className={styles.libraryLocation}>{location.location}</h3>
                <span>{location.campus}</span>
              </div>
              <div className={styles.col2}>
                <span className={styles.openClosed}>{location.in_range ? 'Open' : 'Closed'}</span>
                <span>
                  {openHours(location)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

LibraryHours.propTypes = {
  hours: PropTypes.object.isRequired,
  timeFormat: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(LibraryHours)
