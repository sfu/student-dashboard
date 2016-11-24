import React, { PropTypes } from 'react'
import { Marker } from 'react-leaflet'
import { setSelectedStop } from 'actions/transit'
import { connect } from 'react-redux'

const mapPropsToState = state => {
  return {
    transit: state.transit
  }
}

const BusStopMarker = ({stop, dispatch, transit}) => {
  const { selectedStop } = transit
  return (
    <Marker
      position={{
        lat: stop.Latitude,
        lng: stop.Longitude
      }}
      zIndexOffset={selectedStop && selectedStop.StopNo === stop.StopNo ? 1000 : 0}
      draggable={false}
      onClick={ () => { dispatch(setSelectedStop(stop)) } }
    />
  )
}

BusStopMarker.propTypes = {
  stop: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  transit: PropTypes.object.isRequired
}

export default connect(mapPropsToState)(BusStopMarker)
