import {default as React, PropTypes} from 'react'
import moment from 'moment'
import { RoomFinderLink } from 'components/RoomFinderLink'
import styles from './WeekAtAGlance.css'
import { COURSE_TYPES } from 'const'

const itemLocation = (item) => {
  if (item.location_campus.toLowerCase() === 'burnaby') {
    return <RoomFinderLink building={item.location_buildingcode} room={item.location_roomnumber} />
  } else {
    return <span>{item.location_buildingcode} {item.location_roomnumber}</span>
  }
}

const ScheduleItem = ({item}) => {
  const start_at = moment(item.start_at).format('h:mm A')
  const end_at = item.end_at ? moment(item.end_at).format('h:mm A') : null
  const time = item.start_at === item.end_at ? start_at : `${start_at} - ${end_at}`


  const classTypes = Object.keys(COURSE_TYPES)
  let title, details
  let type = classTypes.indexOf(item.type) >= 0 ? COURSE_TYPES[item.type] : item.type

  if (item.dept && item.number) {
    title = `${item.dept} ${item.number}`
  } else {
    title = item.title
  }

  if (item.location_buildingcode && item.location_roomnumber) {
    details = (
      <span>
        <span className={styles.activityType}>{type}</span> » {itemLocation(item)}
      </span>
    )
  } else {
    details = (
      <span>
        <span className={styles.activityType}>{type}</span> » <a href={item.url}>{item.title}</a>
      </span>
    )
  }

  return (
    <tr className={styles.activityItem}>
      <td className={styles.activityTime}>{time}</td>
      <td>
        <span className={styles.activityName}>{title}</span>
        <span className={styles.activityDetails}>{details}</span>
      </td>
    </tr>
  )
}

ScheduleItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default ScheduleItem
