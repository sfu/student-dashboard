import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  searchForStop,
  updateStopSearchFieldValue
} from 'actions/transit'
import styles from './TransitStopSearch.css'

class TransitStopSearch extends React.Component {
  constructor() {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit = (ev) => {
    const { dispatch, transit } = this.props
    ev.preventDefault()
    ev.persist()
    const stopNumber = transit.searchForStopFieldValue
    if (!stopNumber) { return false }
    dispatch(searchForStop(stopNumber, this.context.router))
    ev.target.firstChild.blur()
  }

  handleChange = (ev) => {
    ev.preventDefault()
    this.props.dispatch(updateStopSearchFieldValue(ev.target.value))
  }

  render() {
    const renderError = (error) => {
      if (!error) { return null }
      const message = error && error.Message ? error.Message : 'An error occurred while searching for your stop. Please try again.'
      return <p className={styles.error}>{message}</p>
    }

    const {
      searchForStopFieldValue,
      searchingForStopError
    } = this.props.transit
    return (
      <div className={styles.container}>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            className={styles.input}
            type="tel"
            placeholder="Search for Bus Stop"
            value={searchForStopFieldValue}
            onClick={() => {this.props.dispatch(updateStopSearchFieldValue(''))}}
          />
        </form>
        {renderError(searchingForStopError)}
      </div>
    )
  }
}

TransitStopSearch.propTypes = {
  transit: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

TransitStopSearch.contextTypes = {
  router: PropTypes.object
}

export default connect(state => ({ transit: state.transit }))(TransitStopSearch)
