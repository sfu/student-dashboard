import {default as React, PropTypes} from 'react'
import styles from './WeekAtAGlance.css'

const ScheduleTable = ({children}) => {
  return (
    <table className={styles.schedule}>
      <caption className={styles.caption}>Schedule for Today</caption>
      <thead className={styles.thead}>
        <tr>
          <th>Time</th>
          <th>Activity</th>
        </tr>
      </thead>

      <tbody>
        {children}
      </tbody>
    </table>
  )
}

ScheduleTable.propTypes = {
  children: PropTypes.array.isRequired
}

export default ScheduleTable
