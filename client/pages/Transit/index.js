import React from 'react'
import { connect } from 'react-redux'
import TransitMap from 'components/TransitMap'

const mapStateToProps = state => ({
  transit: state.transit
})

const Transit = () => {
  return (
    <div>
      <TransitMap />
    </div>

  )
}

export default connect(mapStateToProps)(Transit)
