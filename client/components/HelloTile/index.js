import React, { PropTypes }  from 'react'
import Relay from 'react-relay'
import formatDate from 'date-fns/format'
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import calcTermForDate from 'utils/calcTermForDate'
import Collapse from 'react-collapse'
import { presets } from 'react-motion'
import ReactGA from 'react-ga'

import styles from './HelloTile.css'

export const _HelloTile = React.createClass({
  today: new Date().getDay(),

  propTypes: {
    names: PropTypes.object,
    helloTileSchedule: PropTypes.object
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
    ReactGA.event({
      category: 'HelloTile',
      action: nextHide ? 'hide' : 'show'
    })
  },

  numberOfItemsOfType(data, type) {
    if (typeof type === 'string') {
      type = [type]
    }
    return data.filter(i => new Date(i.start_at).getDay() === this.today && type.indexOf(i.type) >= 0).length
  },

  youHave(data) {
    const stats = {
      exam: this.numberOfItemsOfType(data, 'exam'),
      class: this.numberOfItemsOfType(data, ['lec', 'lab', 'sem', 'tut']),
      event: this.numberOfItemsOfType(data, 'event'),
      assignment: this.numberOfItemsOfType(data, 'assignment')
    }

    const strings = Object.keys(stats).map(t => {
      const qty = stats[t]
      if (qty === 0) { return null }
      if (qty > 1) {
        if (t === 'class') {
          return `${qty} classes`
        } else if (t === 'assignment') {
          return `${qty} assignments due`
        } else {
          return `${qty} ${t}s`
        }
      } else {
        return t === 'assignment' ? `${qty} ${t} due` : `${qty} ${t}`
      }
    }).filter(t => !!t)

    let str
    switch (strings.length) {
      case 0:
        str = <span>You have nothing scheduled for today.</span>
        break
      case 2:
        str = <span>You have <b>{strings.join(' and ')}</b> today</span>
        break
      default:
        str = <span>You have <b>{[strings.slice(0, -1).join(', '), strings.slice(-1)[0]].join(strings.length < 2 ? '' : ', and ')}</b> today.</span>
    }

    return str
  },

  render() {
    const {names, helloTileSchedule} = this.props
    const name = names.commonname ? names.commonname : names.firstnames

    return (
      <Collapse
        isOpened={!this.state.hide}
        springConfig={presets.stiff}
      >
      <div className={styles.helloTile}>
        <p className={styles.p}>Hello, <b>{name}</b>.</p>
        <p className={styles.p}>{this.youHave(helloTileSchedule.scheduleForRangeInTerm)}</p>
        <div className={styles.buttonContainer}>
        <button
          onClick={this.toggleHide}
          className={styles.button}
        >Got it!</button>
        </div>
      </div>
      </Collapse>
    )
  }
})

export const HelloTile = Relay.createContainer(_HelloTile, {
  initialVariables: {
    term: calcTermForDate(),
    scheduleStartAt: formatDate(startOfDay(new Date()), 'YYYY-MM-DD'),
    scheduleEndAt: formatDate(endOfDay(new Date()), 'YYYY-MM-DD')
  },

  fragments: {
    names: () => Relay.QL`
      fragment on ViewerType {
        firstnames
        commonname
      }
    `,
    helloTileSchedule: () => Relay.QL`
      fragment on ViewerType {
        scheduleForRangeInTerm(term: $term, rangeStart: $scheduleStartAt, rangeEnd: $scheduleEndAt) {
          type
          start_at
          end_at
        }
      }
    `
  }
})
