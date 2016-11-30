import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  addTransitBookmark,
  removeTransitBookmark
} from 'actions/preferences'
import transformTranslinkText from 'utils/transformTranslinkText'
import BusIcon from '!url!./bus.svg'
import RealTimeIcon from '!url!./bus-waves.svg'
import BookmarkIconHollow from '!url!./Bookmark.svg'
import BookmarkIconFilled from '!url!./BookmarkFilled.svg'
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


const BusScheduleRow = ({ stopNumber, schedules, transitBookmarks, dispatch }) => {
  const bookmarksForStop = transitBookmarks[stopNumber] || []
  const routeIsBookmarked = bookmarksForStop.includes(schedules.RouteNo)
  const BookmarkIcon = routeIsBookmarked ? BookmarkIconFilled : BookmarkIconHollow
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
      <input
        type="image"
        className={styles.bookmarkButton}
        src={BookmarkIcon}
        onClick={() => {
          if (routeIsBookmarked) {
            dispatch(removeTransitBookmark(stopNumber, schedules.RouteNo))
          } else {
            dispatch(addTransitBookmark(stopNumber, schedules.RouteNo))
          }
        }}
      />
    </div>
  )
}

BusScheduleRow.propTypes = {
  stopNumber: PropTypes.string.isRequired,
  schedules: PropTypes.object.isRequired,
  transitBookmarks: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    transitBookmarks: state.preferences.transitBookmarks
  }
}

export default connect(mapStateToProps)(BusScheduleRow)
