import React, { PropTypes } from 'react'
import { Map, TileLayer, Circle } from 'react-leaflet'
import { connect } from 'react-redux'
import {
  getPositionStart,
  getPositionSuccess,
  getPositionError
} from 'actions/position'
import {
  fetchStops,
  toggleCurrentLocationOnMap,
  updateMapCenter,
  updateMapZoom,
  toggleLocateOnMount
} from 'actions/transit'
import BusStopMarker from 'components/BusStopMarker'
import '!style!css!leaflet/dist/leaflet.css' // don't run leaflet.css through CSS Modules
import './TransitMap.css'

const mapStateToProps = (state) => {
  const { position, transit } = state
  return {
    position,
    transit
  }
}

const markers = (stops) => {
  return stops.map((stop, i) => {
    return <BusStopMarker stop={stop} key={i} />
  })
}

class TransitMap extends React.Component {
  componentDidMount() {
    if (this.props.transit.locateOnMount) {
      const map = this.refs.map.leafletElement
      this.props.dispatch(getPositionStart())
      map.locate({
        setView: true,
        enableHighAccuracy: true
      })
    }
  }

  handleLocationFound = (e) => {
    const { latitude, longitude, accuracy } = e
    const calcRadius = accuracy => {
      const DEFAULT = 600
      if (accuracy > 2000) return 2000
      if (accuracy > 600 && accuracy <= 2000) return accuracy
      return DEFAULT
    }
    this.props.dispatch(getPositionSuccess({ latitude, longitude, accuracy }))
    this.props.dispatch(toggleCurrentLocationOnMap(true))
    this.props.dispatch(fetchStops({
      latitude: parseFloat(latitude).toFixed(5),
      longitude: parseFloat(longitude).toFixed(5)
    }, calcRadius(accuracy)))
  }

  handleLocationError = err => {
    this.props.dispatch(getPositionError(err))
  }

  handleMapDrag = () => {
    const map = this.refs.map.leafletElement
    const originalCenter = this.props.transit.mapCenter
    const { dispatch } = this.props
    const newCenter = map.getCenter()
    dispatch(updateMapCenter(newCenter))
    dispatch(toggleLocateOnMount(false))
    const distanceMoved = originalCenter.distanceTo(newCenter)
    if (distanceMoved > 250) {
      dispatch(toggleCurrentLocationOnMap(false))
      dispatch(fetchStops({
        latitude: parseFloat(newCenter.lat).toFixed(5),
        longitude: parseFloat(newCenter.lng).toFixed(5)
      }, 600))
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   const nextTransit = nextProps.transit
  //   const currentTransit = this.props.transit
  //   const scu = nextTransit.forceMapUpdate ||
  //               nextTransit.showCurrentLocationOnMap != currentTransit.showCurrentLocationOnMap
  //   console.log({scu})
  //   return scu
  // }
  handleMapZoom = () => {
    const map = this.refs.map.leafletElement
    const { dispatch } = this.props
    // zooming can change the center point of the map
    // so dispatch both updateMapZoom and updateMapCenter
    dispatch(updateMapZoom(map.getZoom()))
    dispatch(updateMapCenter(map.getCenter()))
    dispatch(toggleLocateOnMount(false))
  }

  render() {
    const {
      stops,
      showCurrentLocationOnMap,
      mapCenter,
      mapZoom
    } = this.props.transit

    const { latitude, longitude, accuracy } = this.props.position
    return (
      <div>
        <Map
          ref="map"
          center={mapCenter}
          zoom={mapZoom}
          animate={true}
          onLocationfound={this.handleLocationFound}
          onLocationerror={this.handleLocationError}
          onDragend={this.handleMapDrag}
          onZoomEnd={this.handleMapZoom}
        >
          <TileLayer
            url={process.env.MAPBOX_TILES_URL}
          />
          { (stops.length > 0) && (mapZoom > 13) ? markers(stops) : null }
          { showCurrentLocationOnMap &&
            <Circle
              center={[latitude, longitude]}
              radius={accuracy}
              animate={false}
            />
          }
        </Map>
      </div>
    )
  }
}

TransitMap.propTypes = {
  dispatch: PropTypes.func.isRequired,
  transit: PropTypes.shape({
    fetchingStops: PropTypes.bool.isRequired,
    fetchStopsError: PropTypes.object,
    stops: PropTypes.array.isRequired,
    forceMapUpdate: PropTypes.bool.isRequired,
    showCurrentLocationOnMap: PropTypes.bool.isRequired,
    selectedStop: PropTypes.object,
    fetchingSchedules: PropTypes.bool.isRequired,
    fetchSchedulesError: PropTypes.string,
    schedulesForSelectedStop: PropTypes.array.isRequired,
    mapCenter: PropTypes.object
  }),
  position: PropTypes.shape({
    locating: PropTypes.bool.isRequired,
    error: PropTypes.object,
    lastUpdated: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    accuracy: PropTypes.number
  })
}

export default connect(mapStateToProps)(TransitMap)
