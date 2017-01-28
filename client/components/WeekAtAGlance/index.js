import React, { PropTypes }  from 'react'
import Relay from 'react-relay'
import formatDate from 'date-fns/format'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import calcTermForDate from 'utils/calcTermForDate'
import styles from './WeekAtAGlance.css'
import ScheduleTable from './ScheduleTable'
import WeekAtAGlanceScheduleItem from 'components/WeekAtAGlanceScheduleItem'

export const _WeekAtAGlance = ({schedule, selectedDay}) => {
  const items = schedule.scheduleForRangeInTerm
              .filter((item) => new Date(item.start_at).getDay() === selectedDay)
              .map((item, i) => (<WeekAtAGlanceScheduleItem key={i} item={item}/>))


  return (
    <div className={styles.scheduleContainer}>
      {items.length ? <ScheduleTable>{items}</ScheduleTable> : <p>Nothing Scheduled</p>}
    </div>
  )
}

_WeekAtAGlance.propTypes = {
  schedule: PropTypes.object.isRequired,
  selectedDay: PropTypes.number
}

export const WeekAtAGlance = Relay.createContainer(_WeekAtAGlance, {
  initialVariables: {
    term: calcTermForDate(),
    scheduleStartAt: formatDate(startOfWeek(new Date()), 'YYYY-MM-DD'),
    scheduleEndAt: formatDate(endOfWeek(new Date()), 'YYYY-MM-DD')
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
