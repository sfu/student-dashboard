import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import TransitMap from 'components/TransitMap'
import BusSchedules from 'components/BusSchedules'

const mapStateToProps = state => ({
  transit: state.transit
})

const Transit = ({transit}) => {
  return (
    <div>
      <TransitMap />
      {transit.selectedStop &&
        <BusSchedules
          selectedStop={transit.selectedStop}
          schedules={transit.schedulesForSelectedStop}
        />
      }
    </div>

  )
}

Transit.propTypes = {
  transit: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Transit)
