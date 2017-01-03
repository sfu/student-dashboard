import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { RoomFinderLink } from 'components/RoomFinderLink'
import { OutboundLink } from 'react-ga'
import formatTimeRange from 'utils/formatTimeRange'
import styles from './ScheduleItem.css'
import { CLASS_TYPES } from 'const'

const itemLocation = (item) => {
  if (item.location_campus.toLowerCase() === 'burnaby') {
    return <RoomFinderLink building={item.location_buildingcode} room={item.location_roomnumber} />
  } else {
    return <span>{item.location_buildingcode} {item.location_roomnumber}</span>
  }
}

const ScheduleItem = ({ item, timeFormat }) => {
  const classTypes = Object.keys(CLASS_TYPES)
  let title, details
  let type = classTypes.indexOf(item.type) >= 0 ? CLASS_TYPES[item.type] : item.type

  if (item.dept && item.number) {
    title = `${item.dept} ${item.number} ${type}`
  } else {
    title = item.title
  }

  if (item.location_buildingcode && item.location_roomnumber) {
    details = (
      <span>
        {itemLocation(item)} ({item.location_campus})
      </span>
    )
  } else {
    details = (
      <span>
        {
          item.url ?
          <OutboundLink
            eventLabel={item.url}
            to={item.url}
          >
            {item.title}
          </OutboundLink>
          : <span>{item.title}</span>
        }
      </span>
    )
  }

  return (
    <tr className={styles.activityItem}>
      <td>
        <span className={styles.activityName}>{title}</span>
        <span>{details}</span>
      </td>
      <td className={styles.activityTime}><span>{formatTimeRange(moment(item.start_at), moment(item.end_at), timeFormat)}</span></td>
    </tr>
  )
}

ScheduleItem.propTypes = {
  item: PropTypes.object.isRequired,
  timeFormat: PropTypes.string.isRequired
}

export default connect(state => ({ timeFormat: state.preferences.preferenceData.timeFormat }))(ScheduleItem)
