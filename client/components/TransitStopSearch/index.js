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
    this.handleSubmitFocus = this.handleSubmitFocus.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleSubmit = (ev) => {
    const { dispatch, transit } = this.props
    ev.preventDefault()
    const stopNumber = transit.searchForStopFieldValue
    if (!stopNumber) { return false }
    dispatch(searchForStop(stopNumber, this.context.router))
  }

  handleChange = (ev) => {
    ev.preventDefault()
    this.props.dispatch(updateStopSearchFieldValue(ev.target.value))
  }

  handleSubmitFocus = (ev) => {
    this.handleSubmit(ev)
    ev.target.blur()
  }

  handleKeyDown = (ev) => {
    const { keyCode } = ev
    if ( keyCode === 13 ) {
      ev.target.blur()
    }
  }

  handleFocus = () => {
    this.props.dispatch(updateStopSearchFieldValue(''))
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
        <input
          className={styles.input}
          type="number"
          pattern="[0-9]*"
          placeholder="Search for Bus Stop"
          value={searchForStopFieldValue}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleSubmit}
        />
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
