import React from 'react'
import axios from 'axios'
import styles from './LibraryHours.css'

const LibraryHours = React.createClass({
  libraryHoursUrl: 'https://www.sfu.ca/bin/library-hours.json',
  campusMapping: {
    'Bennett Library': 'Burnaby Campus',
    'Fraser Library': 'Surrey Campus',
    'Belzberg Library': 'Vancouver Campus'
  },

  propTypes: {},

  getInitialState() {
    return {
      fetching: true,
      error: false,
      hours: []
    }
  },

  componentDidMount() {
    axios.get(this.libraryHoursUrl).then(({data}) => {
      // augment `data` with a campus field using `this.campusMapping`
      this.setState({
        hours: data.map((item) => ({...item, campus: this.campusMapping[item.location]})),
        fetching: false
      })
    }).catch((error) => {
      this.setState({
        fetching: false,
        error
      })
    })
  },

  render() {
    return (
      <div className={styles.libraryHours}>
        {
          this.state.fetching ? <p>Checking Libary Hours...</p> :
          <ul className={styles.libraryHoursList}>
            {this.state.hours.map((location, index) => (
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
})

export default LibraryHours
