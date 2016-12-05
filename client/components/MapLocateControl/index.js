import React, { PropTypes, Component } from 'react'
import Control from 'react-leaflet-control'
import { connect } from 'react-redux'
import L from 'leaflet'
import classNames from 'classnames'
import {
  getPosition,
  getPositionSuccess,
  getPositionError
} from 'actions/position'
import {
  updateMapCenter,
  updateMapZoom,
  toggleCurrentLocationOnMap,
  fetchStops,
  setSelectedStop
} from 'actions/transit'
import CompassBlack from '!url!./compass_black.svg'
import CompassBlue from '!url!./compass_blue.svg'
import styles from './MapLocateControl.css'

class MapLocateControl extends Component {
  handleClick = () => {
    const { dispatch } = this.props
    dispatch(getPosition({
      enableHighAccuracy: true
    })).then((position) => {
      const { latitude, longitude } = position.coords
      const nextMapCenter = new L.latLng(latitude, longitude)
      dispatch(getPositionSuccess(position.coords))
      dispatch(fetchStops(position.coords, 600))
      dispatch(setSelectedStop(null))
      dispatch(updateMapZoom(18))
      dispatch(updateMapCenter(nextMapCenter))
      dispatch(toggleCurrentLocationOnMap(true))
    }).catch((error) => { dispatch(getPositionError(error)) })
  }

  render() {
    const { locating } = this.props.position
    const { showCurrentLocationOnMap } = this.props.transit
    const iconClassNames = classNames({
      [`${styles.compassIcon}`]: true,
      [`${styles.locating}`]: locating
    })
    const iconUrl = showCurrentLocationOnMap ? CompassBlue : CompassBlack
    return (
      <Control position='bottomleft' className='leaflet-touch leaflet-bar'>
        <div className={styles.container}>
          <input
            className={iconClassNames}
            type="image"
            src={iconUrl}
            onClick={this.handleClick}
            title="Find current location"
          />
        </div>
      </Control>
    )
  }
}

MapLocateControl.propTypes = {
  position: PropTypes.object.isRequired,
  transit: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapPropsToState = state => {
  return {
    position: state.position,
    transit: state.transit
  }
}

export default connect(mapPropsToState)(MapLocateControl)
