import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import styles from './HelloTile.css'

export const _HelloTile = React.createClass({
  propTypes: {
    names: PropTypes.object
  },

  getInitialState() {
    return {
      hide: false
    }
  },

  toggleHide() {
    const nextHide = !this.state.hide
    this.setState({
      hide: nextHide
    }, () => {
    })
  },

  render() {
    const {names} = this.props
    const name = names.commonname ? names.commonname : names.firstnames
    return this.state.hide ? null : (
      <div className={styles.helloTile}>
        <p className={styles.p}>Hello, <b>{name}</b>.</p>
        <p className={styles.p}>You have <b>?? class</b> and <b>?? assignments</b> due today.</p>
        <div className={styles.buttonContainer}>
        <button
          onClick={this.toggleHide}
          className={styles.button}
        >Got it!</button>
        </div>
      </div>
    )
  }
})

export const HelloTile = Relay.createContainer(_HelloTile, {
  fragments: {
    names: () => Relay.QL`
      fragment on UserBioType {
        firstnames
        commonname
      }
    `
  }
})
