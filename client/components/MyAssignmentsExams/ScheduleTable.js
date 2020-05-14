import React, { PropTypes } from 'react';
import styles from './MyAssignmentsExams.css';

const ScheduleTable = ({ date, children }) => {
  return (
    <div className={styles.scheduleTableContainer}>
      <h2 className={styles.date}>{date}</h2>
      <table className={styles.schedule}>
        <caption className={styles.caption}>Schedule for {date}</caption>
        <thead className={styles.thead}>
          <tr>
            <th>Time</th>
            <th>Activity</th>
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

ScheduleTable.propTypes = {
  date: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

export default ScheduleTable;
