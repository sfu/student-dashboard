import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import formatTime from 'utils/formatTime';
import { fetchSchedulesForBookmarks } from 'actions/transit';

import DashboardTransitBookmarkRow from 'components/DashboardTransitBookmarkRow';
import styles from './DashboardTransitBookmarks.css';

const renderRows = (schedules) => {
  const rows = Object.keys(schedules).map((b, i) => {
    return <DashboardTransitBookmarkRow key={i} busRoute={schedules[b]} />;
  });

  return rows.length ? rows : null;
};

class DashboardTransitBookmarks extends Component {
  constructor() {
    super();

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    ReactGA.event({
      category: 'Transit',
      action: 'Refresh DashboardTransitBookmarks',
    });
    this.props.dispatch(fetchSchedulesForBookmarks());
  }

  render() {
    const {
      transitBookmarksSchedules,
      transitBookmarksSchedulesFetchedAt,
    } = this.props.transit;
    const { timeFormat } = this.props;
    return (
      <div className={styles.container}>
        {transitBookmarksSchedulesFetchedAt && (
          <div className={styles.scheduleControls}>
            <p className={styles.fetchedAt}>
              Predictions as of{' '}
              {formatTime(transitBookmarksSchedulesFetchedAt, timeFormat)}
            </p>
            <button className={styles.refreshButton} onClick={this.refresh}>
              Refresh
            </button>
          </div>
        )}
        {renderRows(transitBookmarksSchedules)}
      </div>
    );
  }
}

DashboardTransitBookmarks.propTypes = {
  transit: PropTypes.object.isRequired,
  timeFormat: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    transit: state.transit,
    timeFormat: state.preferences.preferenceData.timeFormat,
  };
};

export default connect(mapStateToProps)(DashboardTransitBookmarks);
