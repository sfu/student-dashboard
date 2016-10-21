import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import moment from 'moment'
import calcTerm from 'utils/calcTerm'
import styles from './WeekAtAGlance.css'
import ScheduleTable from './ScheduleTable'
import ScheduleItem from './ScheduleItem'
import Dots from './Dots'

export const _WeekAtAGlance = React.createClass({
  propTypes: {
    schedule: PropTypes.object.isRequired,
    start_at: PropTypes.string
  },

  getInitialState() {
    let { start_at } = this.props
    start_at = parseInt(start_at)
    const today = moment().day()
    return {
      selectedDay: !isNaN(start_at) && (start_at >= 0 && start_at <= 6) ? start_at : today,
      backDisabled: today === 0,
      forwardDisabled: today === 6
    }
  },

  daysOfWeek: [...Array(7).keys()].map(d => moment().day(d)),

  toggleSelectedDay(direction) {
    const MIN = 0
    const MAX = 6
    const {selectedDay} = this.state
    const nextSelectedDay = direction === '>' ? selectedDay + 1 : selectedDay - 1
    if (nextSelectedDay >= MIN && nextSelectedDay <= MAX) {
      this.setState({
        selectedDay: nextSelectedDay,
        backDisabled: nextSelectedDay === 0,
        forwardDisabled: nextSelectedDay === 6
      })
    }
  },

  render() {
    const {selectedDay} = this.state
    const items = this.props.schedule.scheduleForRangeInTerm
                .filter((item) => moment(item.start_at).day() === selectedDay)
                .map((item, i) => (<ScheduleItem key={i} item={item}/>))

    const headerDate = moment().day(selectedDay)
    const isToday = moment().isSame(headerDate)

    return (
      <div id="weekAtAGlance">
        <div className={styles.header}>
          <button
            id="weekAtAGlance_previousDay"
            disabled={this.state.backDisabled}
            className={styles.dateButton}
            onClick={() => {this.toggleSelectedDay('<')}}
            >
              &lt;
            </button>
          <span className={styles.date}>{isToday ? 'today' : headerDate.format('dddd, MMMM DD')}</span>
          <button
            id="weekAtAGlance_nextDay"
            disabled={this.state.forwardDisabled}
            className={styles.dateButton}
            onClick={() => {this.toggleSelectedDay('>')}}
          >
            &gt;
          </button>
        </div>
        <div className={styles.scheduleContainer}>
          {items.length ? <ScheduleTable>{items}</ScheduleTable> : <p>Nothing Scheduled</p>}
          <Dots count={7} activeDot={this.state.selectedDay} />
        </div>
      </div>
    )
  }
})

export const WeekAtAGlance = Relay.createContainer(_WeekAtAGlance, {
  initialVariables: {
    term: calcTerm(),
    scheduleStartAt: moment().startOf('week').format('YYYY-MM-DD'),
    scheduleEndAt: moment().endOf('week').format('YYYY-MM-DD')
  },
  fragments: {
    schedule: () => Relay.QL`
      fragment on ViewerType {
        scheduleForRangeInTerm(term: $term, rangeStart: $scheduleStartAt, rangeEnd: $scheduleEndAt) {
          dept
          description
          end_at
          location_address
          location_buildingcode
          location_campus
          location_name
          location_roomnumber
          number
          section
          source
          start_at
          title
          type
          url
        }
      }
    `
  }
})
