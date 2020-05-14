import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Collapse from 'react-collapse';
import { presets } from 'react-motion';
import { connect } from 'react-redux';
import { Widget } from 'components/Widget';
import Pageable from 'components/Pageable';
import { HelloTile } from 'components/HelloTile';
import { WeekAtAGlance } from 'components/WeekAtAGlance';
import DashboardNavGrid from 'components/DashboardNavGrid';
import DashboardTransitBookmarks from 'components/DashboardTransitBookmarks';
import { fetchSchedulesForBookmarks } from 'actions/transit';
import formatDate from 'date-fns/format';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import eachDay from 'date-fns/each_day';
import styles from './Dashboard.css';

class _Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      transitBookmarksFetchTimer: null,
    };
  }

  componentDidMount() {
    const timer = setInterval(() => {
      this.props.dispatch(fetchSchedulesForBookmarks());
    }, 60000);
    this.setState({
      transitBookmarksFetchTimer: timer,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.transitBookmarksFetchTimer);
  }

  render() {
    const {
      helloTile,
      transit,
      viewer,
      location: { query },
    } = this.props;
    const { start_at } = query;
    const todayDate = new Date();
    const today = todayDate.getDay();
    const daysInWeek = eachDay(
      startOfWeek(todayDate),
      endOfWeek(todayDate)
    ).map((d) => formatDate(d, 'dddd, MMMM DD'));
    const selectedDay =
      !isNaN(start_at) && start_at >= 0 && start_at <= 6
        ? parseInt(start_at)
        : today;
    return (
      <div className={styles.dashboard}>
        <Collapse isOpened={!helloTile.hide} springConfig={presets.stiff}>
          <HelloTile helloTileSchedule={viewer} names={viewer} />
        </Collapse>
        <Widget title="My Week at a Glance">
          <Pageable
            pagerTitles={[...Array(7).keys()].map((d) =>
              d === today ? 'Today' : daysInWeek[d]
            )}
            pageCount={7}
            startAtPage={selectedDay}
            gaCategory="WeekAtAGlance"
          >
            <WeekAtAGlance schedule={viewer} selectedDay={selectedDay} />
          </Pageable>
        </Widget>
        {!!transit.transitBookmarks.length && (
          <Widget title="My Buses">
            <div style={{ margin: '1em' }}>
              <DashboardTransitBookmarks />
            </div>
          </Widget>
        )}
        <DashboardNavGrid />
      </div>
    );
  }
}

_Dashboard.propTypes = {
  viewer: PropTypes.object,
  location: PropTypes.object,
  transit: PropTypes.object.isRequired,
  helloTile: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  transit: state.transit,
  helloTile: state.helloTile,
});

export default connect(mapStateToProps)(
  Relay.createContainer(_Dashboard, {
    fragments: {
      viewer: () => Relay.QL`
      fragment viewer on ViewerType {
        ${HelloTile.getFragment('names')}
        ${HelloTile.getFragment('helloTileSchedule')}
        ${WeekAtAGlance.getFragment('schedule')}
      }
    `,
    },
  })
);
