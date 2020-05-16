import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TransitMap from 'components/TransitMap';
import BusSchedules from 'components/BusSchedules';
import DashboardTransitBookmarks from 'components/DashboardTransitBookmarks';
import TransitStopSearch from 'components/TransitStopSearch';
import styles from './Transit.css';

const mapStateToProps = (state) => ({
  transit: state.transit,
});

const Transit = ({ transit }) => {
  return (
    <div className={styles.transit}>
      <TransitStopSearch />
      <TransitMap />
      {!transit.selectedStop &&
        !!Object.keys(transit.transitBookmarksSchedules).length && (
          <div>
            <div className={styles.myBusesHeader}>
              <h1 className={styles.myBuses}>My Buses</h1>
            </div>
            <DashboardTransitBookmarks />
          </div>
        )}
      {transit.selectedStop && (
        <BusSchedules
          selectedStop={transit.selectedStop}
          schedules={transit.schedulesForSelectedStop}
        />
      )}
    </div>
  );
};

Transit.propTypes = {
  transit: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Transit);
