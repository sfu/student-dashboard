import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';
import BusScheduleRow from 'components/BusScheduleRow';
import transformTranslinkText from 'utils/transformTranslinkText';
import Loading from 'components/Loading';
import { connect } from 'react-redux';
import formatTime from 'utils/formatTime';
import { fetchSchedulesForBusStop } from 'actions/transit';
import styles from './BusSchedules.css';

const mapStateToProps = (state) => {
  return {
    transit: state.transit,
    timeFormat: state.preferences.preferenceData.timeFormat,
  };
};

const scheduleRows = (stop, schedules) => {
  return schedules.map((schedule, i) => (
    <BusScheduleRow
      stopNumber={stop.toString()}
      busNumber={schedule.RouteNo}
      schedules={schedule}
      key={i}
    />
  ));
};

const BusSchedules = ({
  transit,
  selectedStop,
  schedules,
  dispatch,
  timeFormat,
}) => {
  const refresh = (stop) => {
    ReactGA.event({
      category: 'Transit',
      action: 'Refresh Schedules for Stop',
      label: stop.toString(),
    });
    dispatch(fetchSchedulesForBusStop(stop));
  };
  const stopName = `${transformTranslinkText(
    selectedStop.OnStreet
  )} / ${transformTranslinkText(selectedStop.AtStreet)}`;
  return (
    <div>
      <div className={styles.stopInfoHeader}>
        <h2 className={styles.stopName}>{stopName}</h2>
        <h3 className={styles.stopNumber}>#{selectedStop.StopNo}</h3>
      </div>
      <div className={styles.schedules}>
        {transit.fetchingSchedules && <Loading title="Checking Schedules" />}
        {transit.schedulesFetchedAt && (
          <div className={styles.scheduleControls}>
            <p className={styles.fetchedAt}>
              Prediction as of{' '}
              {formatTime(transit.schedulesFetchedAt, timeFormat)}
            </p>
            <button
              className={styles.refreshButton}
              onClick={() => {
                refresh(selectedStop.StopNo);
              }}
            >
              Refresh
            </button>
          </div>
        )}
        {transit.fetchSchedulesError &&
          transit.fetchSchedulesError.Code === '3005' && (
            <p style={{ textAlign: 'center' }}>
              No upcoming departures for this stop.
            </p>
          )}
        {scheduleRows(selectedStop.StopNo, schedules)}
      </div>
    </div>
  );
};

BusSchedules.propTypes = {
  selectedStop: PropTypes.object.isRequired,
  schedules: PropTypes.array.isRequired,
  transit: PropTypes.object.isRequired,
  timeFormat: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(BusSchedules);
