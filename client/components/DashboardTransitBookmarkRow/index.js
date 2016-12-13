import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import LoadingSpinnerIcon from 'components/LoadingSpinnerIcon'
import BusIcon from '!url!images/transit/bus.svg'
import CaretRight from '!url!images/transit/caret_right.svg'
import styles from './DashboardTransitBookmarkRow.css'
import transformTranslinkText from 'utils/transformTranslinkText'

const renderStops = (stops, isFetching) => stops.map((stop, i) => {
  const { number, onStreet, atStreet, nextArrival} = stop
  const time =  nextArrival.ExpectedCountdown < 2 ? 'Now' : `${nextArrival.ExpectedCountdown} min`
  return (
    <Link key={i} className={styles.link} to={`/transit/${number}`}>
      <li className={styles.listItem}>
        <div className={styles.container}>
          <div className={styles.stopInfo}>
            <p>{`${transformTranslinkText(onStreet)} / ${transformTranslinkText(atStreet)}`}</p>
            <p>{number}</p>
          </div>
          <div className={styles.nextArrivalTime}>
            {!isFetching && <span>{time}</span>}
            {isFetching && (
              <div style={{
                  height: '15px',
                  width: '15px',
                  float: 'right'
              }}>
                <LoadingSpinnerIcon />
              </div>
            )}
          </div>
          <div className={styles.linkContainer}>
            <img src={CaretRight} alt={`More information for stop ${number}`} className={styles.linkCaret} />
          </div>
        </div>
      </li>
    </Link>
  )
})


const DashboardTransitBookmarkRow = ({busRoute, transit}) => {
  const { route, destination, stops } = busRoute
  return (
      <div className={styles.row}>
        <img src={BusIcon} alt="Bus Icon" className={styles.busIcon}/>
        <div className={styles.routeInfo}>
          <h1 className={styles.route}>{route} {transformTranslinkText(destination)}</h1>
          <ul className={styles.list}>
            { stops && renderStops(stops, transit.fetchingSchedulesForBookmarks) }
          </ul>
        </div>
      </div>
  )
}

DashboardTransitBookmarkRow.propTypes = {
  busRoute: PropTypes.object.isRequired,
  transit: PropTypes.object.isRequired
}

export default connect((state) => ({ transit: state.transit }))(DashboardTransitBookmarkRow)
