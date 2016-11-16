import { default as React, PropTypes } from 'react'
import { connect } from 'react-redux'

import styles from './LibraryHours.css'

const mapStateToProps = state => {
  return {
    hours: state.library.hours
  }
}

const LibraryHours = ({hours}) => {
  return (
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
                <span>{location.open_time} - {location.close_time}</span>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

LibraryHours.propTypes = {
  hours: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(LibraryHours)
