import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import plural from 'utils/plural'
import moment from 'moment'
import styles from './HelloTile.css'

export const _HelloTile = React.createClass({
  propTypes: {
    names: PropTypes.object,
    schedule: PropTypes.object
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
    })
  },

  render() {
    const {names, schedule} = this.props
    const name = names.commonname ? names.commonname : names.firstnames
    const today = moment().day()
    const stats = {
      classes: schedule.edges.nodes.filter(item => moment(item.start_at).day() === today && item.type === 'class').length,
      assignments: schedule.edges.nodes.filter(item => moment(item.start_at).day() === today && item.type === 'assignment').length
    }

    let youHave
    if (stats.classes === 0 && stats.assignment === 0) {
      youHave = <span>You have nothing scheduled for today</span>
    } else if (stats.classes > 0 && stats.assignments === 0) {
      youHave = <span>You have <b>{stats.classes} {plural('class', stats.classes)}</b> today.</span>
    } else if (stats.classes === 0 && stats.assignmets > 0) {
      youHave = <span>You have <b>{plural('assignment'), stats.assignments}</b> due today.</span>
    } else {
      youHave = <span>You have <b>{stats.classes} {plural('class', stats.classes)}</b> and <b>{stats.assignments} {plural('assignment', stats.assignments)}</b> due today.</span>
    }

    return this.state.hide ? null : (
      <div className={styles.helloTile}>
        <p className={styles.p}>Hello, <b>{name}</b>.</p>
        <p className={styles.p}>{youHave}</p>
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
