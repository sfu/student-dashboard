import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import {
  addTransitBookmark,
  removeTransitBookmark
} from 'actions/transit'
import transformTranslinkText from 'utils/transformTranslinkText'
import BusIcon from '!url!images/transit/bus.svg'
import RealTimeIcon from '!url!images/transit/bus-waves.svg'
import BookmarkIconHollow from '!url!images/transit/Bookmark.svg'
import BookmarkIconFilled from '!url!images/transit/BookmarkFilled.svg'
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
  const destination = schedules.Schedules[0].Destination

  const bookmarkForStop = transitBookmarks.find(bookmark => {
    const clone = {...bookmark, destination: bookmark.destination.toLowerCase()}
    delete clone.id
    return isEqual(
      clone,
      {stop: stopNumber, route: schedules.RouteNo, destination: destination.toLowerCase()}
    )
  })

  const BookmarkIcon = bookmarkForStop ? BookmarkIconFilled : BookmarkIconHollow
  return (
    <div className={styles.row}>
      <img src={BusIcon} alt="Bus Icon" className={styles.busIcon} />
      <div className={styles.routeInfo}>
        <h1 className={styles.routeNumber}>{schedules.RouteNo}</h1>
        <h2 className={styles.destination}>{transformTranslinkText(destination)}</h2>
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
        title={bookmarkForStop ? `Remove from transit bookmarks` : `Add to transit bookmarks`}
        onClick={() => {
          if (bookmarkForStop) {
            dispatch(removeTransitBookmark(bookmarkForStop))
          } else {
            dispatch(addTransitBookmark({stop: stopNumber, route: schedules.RouteNo, destination}))
          }
        }}
      />
    </div>
  )
}

BusScheduleRow.propTypes = {
  stopNumber: PropTypes.string.isRequired,
  schedules: PropTypes.object.isRequired,
  transitBookmarks: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    transitBookmarks: state.transit.transitBookmarks
  }
}

export default connect(mapStateToProps)(BusScheduleRow)
