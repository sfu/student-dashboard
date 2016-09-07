import {default as React, PropTypes} from 'react'
import styles from './WeekAtAGlance.css'

const ScheduleItem = ({item}) => {
  const start_at = new Date(item.start_at).toLocaleTimeString(navigator.language, {hour: 'numeric', minute: 'numeric'})
  const end_at = item.end_at ? new Date(item.end_at).toLocaleTimeString(navigator.language, {hour: 'numeric', minute: 'numeric'}) : null
  const time = end_at ? `${start_at} - ${end_at}` : start_at
  const {title,description,location} = item
  const details = description || location || null
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
