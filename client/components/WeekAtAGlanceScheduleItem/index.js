import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { OutboundLink } from 'react-ga';
import { RoomFinderLink } from 'components/RoomFinderLink';
import formatTimeRange from 'utils/formatTimeRange';
import styles from './ScheduleItem.css';
import { CLASS_TYPES } from 'const';
import cx from 'classnames';

const itemLocation = (item) => {
  if (item.location_campus.toLowerCase() === 'burnaby') {
    return (
      <RoomFinderLink
        building={item.location_buildingcode}
        room={item.location_roomnumber}
      />
    );
  } else {
    return (
      <span>
        {item.location_buildingcode} {item.location_roomnumber}
      </span>
    );
  }
};

const ScheduleItem = ({ item, timeFormat }) => {
  const classTypes = Object.keys(CLASS_TYPES);
  let title, details;
  let type =
    classTypes.indexOf(item.type) >= 0 ? CLASS_TYPES[item.type] : item.type;

  if (item.dept && item.number) {
    title = `${item.dept} ${item.number} ${type}`;
  } else {
    title = item.title;
  }

  if (item.location_buildingcode && item.location_roomnumber) {
    details = <span>{itemLocation(item)}</span>;
  } else {
    details = (
      <span>
        <OutboundLink eventLabel={item.url} to={item.url}>
          {item.title}
        </OutboundLink>
      </span>
    );
  }

  return (
    <tr
      className={
        type === 'exam'
          ? cx(styles.activityItem, styles.exam)
          : styles.activityItem
      }
    >
      <td className={styles.activityTime}>
        {formatTimeRange(
          new Date(item.start_at),
          new Date(item.end_at),
          timeFormat
        )}
      </td>
      <td>
        <span className={styles.activityName}>{title}</span>
        <span>{details}</span>
      </td>
    </tr>
  );
};

ScheduleItem.propTypes = {
  timeFormat: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

export default connect((state) => ({
  timeFormat: state.preferences.preferenceData.timeFormat,
}))(ScheduleItem);
