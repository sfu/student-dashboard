import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
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

  youHave(data) {
    const today = moment().day()
    const stats = {
      classes: data.filter(item => moment(item.start_at).day() === today && item.type === 'class').length,
      assignments: data.filter(item => moment(item.start_at).day() === today && item.type === 'assignment').length
    }
    const classes = stats.classes === 1 ? 'class' : 'classes'
    const assignments = stats.classes === 1 ? 'assignment' : 'assignments'
    if (stats.classes === 0 && stats.assignment === 0) {
      return <span>You have nothing scheduled for today.</span>
    } else if (stats.classes > 0 && stats.assignments === 0) {
      return <span>You have <b>{stats.classes} {classes}</b> today.</span>
    } else if (stats.classes === 0 && stats.assignmets > 0) {
      return <span>You have <b>{stats.assignments} {assignments}</b> due today.</span>
    } else {
      return <span>You have <b>{stats.classes} {classes}</b> and <b>{stats.assignments} {assignments}</b> due today.</span>
    }
  },

  render() {
    const {names, schedule} = this.props
    const name = names.commonname ? names.commonname : names.firstnames

    return this.state.hide ? null : (
      <div className={styles.helloTile}>
        <p className={styles.p}>Hello, <b>{name}</b>.</p>
        <p className={styles.p}>{this.youHave(schedule.edges.nodes)}</p>
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
      fragment on ViewerType {
        firstnames
        commonname
      }
    `
  }
})
