import React, { PropTypes } from 'react';
import { Marker } from 'react-leaflet';
import { connect } from 'react-redux';
import L from 'leaflet';
import ReactGA from 'react-ga';
import BlueIcon from '!url!images/transit/translink_blue.svg';
import RedIcon from '!url!images/transit/translink_red.svg';

const TransitIcon = L.Icon.extend({
  options: {
    shadowUrl: null,
    iconSize: [15, 15],
  },
});

const BusStopIconBlue = new TransitIcon({ iconUrl: BlueIcon });
const BusStopIconRed = new TransitIcon({ iconUrl: RedIcon });

const mapPropsToState = (state) => {
  return {
    transit: state.transit,
  };
};

const BusStopMarker = ({ stop, dispatch, transit }, { router }) => {
  const { selectedStop } = transit;
  return (
    <Marker
      position={{
        lat: stop.Latitude,
        lng: stop.Longitude,
      }}
      icon={
        selectedStop && selectedStop.StopNo === stop.StopNo
          ? BusStopIconRed
          : BusStopIconBlue
      }
      zIndexOffset={
        selectedStop && selectedStop.StopNo === stop.StopNo ? 1000 : 0
      }
      draggable={false}
      onClick={() => {
        ReactGA.event({
          category: 'Transit',
          action: 'Transit Stop Click',
          label: stop.StopNo.toString(),
        });
        router.push(`/transit/${stop.StopNo}`);
      }}
    />
  );
};

BusStopMarker.propTypes = {
  stop: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  transit: PropTypes.object.isRequired,
};

BusStopMarker.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapPropsToState)(BusStopMarker);
