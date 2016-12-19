import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import formatLibraryHours from 'utils/formatLibraryHours'
import libraryIsOpen from 'utils/libraryIsOpen'

import styles from './LibraryHours.css'

const mapStateToProps = state => {
  return {
    hours: state.library.hours,
    timeFormat: state.preferences.preferenceData.timeFormat
  }
}

const LibraryHours = ({ hours, timeFormat }) => {
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
                <span className={styles.openClosed}>{libraryIsOpen(location) ? 'Open' : 'Closed'}</span>
                <span>
                  {formatLibraryHours(location, timeFormat)}
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
