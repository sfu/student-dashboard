import React, { PropTypes } from 'react'
import { Map, TileLayer, Marker, Circle } from 'react-leaflet'
import { connect } from 'react-redux'
import {
  getPositionStart,
  getPositionSuccess,
  getPositionError
} from 'actions/position'
import {
  fetchStops,
  toggleCurrentLocationOnMap
} from 'actions/transit'
import L from 'leaflet'
import '!style!css!leaflet/dist/leaflet.css' // don't run leaflet.css through CSS Modules
import './TransitMap.css'

// Workaround to get default L.Marker icon working
// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-261904061
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: undefined
})
// End Workaround


const mapStateToProps = (state) => {
  const { position, transit } = state
  return {
    position,
    transit
  }
}

const markers = (stops) => {
  return stops.map((stop, i) => (<Marker
    position={{
      lat: stop.Latitude,
      lng: stop.Longitude
    }}
    draggable={false}
    key={i}
  />))
}

class TransitMap extends React.Component {
  componentDidMount() {
    const map = this.refs.map.leafletElement
    this.props.dispatch(getPositionStart())
    map.locate({
      setView: true,
      enableHighAccuracy: true
    })
  }

  handleLocationFound = (e) => {
    const { latitude, longitude, accuracy } = e
    this.props.dispatch(getPositionSuccess({ latitude, longitude, accuracy }))
    this.props.dispatch(toggleCurrentLocationOnMap())
    this.props.dispatch(fetchStops({
      latitude: parseFloat(latitude).toFixed(5),
      longitude: parseFloat(longitude).toFixed(5)
    }))
  }

  handleLocationError = err => {
    this.props.dispatch(getPositionError(err))
  }

  // shouldComponentUpdate(nextProps) {
  //   const nextTransit = nextProps.transit
  //   const currentTransit = this.props.transit
  //   const scu = nextTransit.forceMapUpdate ||
  //               nextTransit.showCurrentLocationOnMap != currentTransit.showCurrentLocationOnMap
  //   console.log({scu})
  //   return scu
  // }

  render() {
    const { stops, showCurrentLocationOnMap } = this.props.transit
    const { latitude, longitude, accuracy } = this.props.position
    return (
      <div>
      <Map
        ref="map"
        center={[49.21490597995439, -123.00018310546876]}
        zoom={10}
        animate={true}
        onLocationfound={this.handleLocationFound}
        onLocationerror={this.handleLocationError}
      >
        <TileLayer
          url={process.env.MAPBOX_TILES_URL}
        />
        { stops.length > 0 ? markers(stops) : null }
        { showCurrentLocationOnMap &&
          <Circle
            center={[latitude, longitude]}
            radius={accuracy}
            animate={false}
          />
        }
      </Map>
      <p>Lat: {latitude}, Lng: {longitude}, Accuracy: {accuracy}</p>
    </div>
    )
  }
}

TransitMap.propTypes = {
  dispatch: PropTypes.func.isRequired,
  transit: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    fetchError: PropTypes.object,
    forceMapUpdate: PropTypes.bool.isRequired,
    stops: PropTypes.array.isRequired,
    showCurrentLocationOnMap: PropTypes.bool.isRequired
  }),
  position: {
    locating: PropTypes.bool.isRequired,
    error: PropTypes.object,
    lastUpdated: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    accuracy: PropTypes.number

  }
}

export default connect(mapStateToProps)(TransitMap)
