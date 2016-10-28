import { default as React, PropTypes } from 'react'
import Relay from 'react-relay'
import { RoomFinderLink } from 'components/RoomFinderLink'
import calcTerm from 'utils/calcTerm'
import {
  CLASS_TYPES,
  REST_SERVER_DAYS_OF_WEEK,
  CALENDAR_DAYS_OF_WEEK
} from 'const'

const DayThingy = ({days}) => {
  const scheduleDays = days.split('')
  const activeStyle = {
    color: 'red'
  }
  const dayEls = REST_SERVER_DAYS_OF_WEEK.map((d, i) => {
    return <span style={scheduleDays.indexOf(d) >= 0 ? activeStyle : null}>{CALENDAR_DAYS_OF_WEEK[i]}</span>
  })
  return (
    <span>{dayEls}</span>
  )
}

DayThingy.propTypes = {
  days: PropTypes.string.isRequired
}

const ScheduleLine = ({ schedule }) => {
  const { startTime, endTime, days, buildingCode, roomNumber } = schedule
  const location = (schedule) => {
    if (schedule.campus.toLowerCase() === 'burnaby') {
      return <RoomFinderLink building={buildingCode} room={roomNumber} />
    } else {
      return <span>{schedule.buildingCode} {schedule.roomNumber}</span>
    }
  }

  return (
    <div>
      <DayThingy days={days} />
      <span>{startTime} - {endTime}</span>
      {location(schedule)}
    </div>
  )
}

ScheduleLine.propTypes = {
  schedule: PropTypes.object.isRequired
}


export const _MyCourses = ({courseSchedule: { enrolledCourses }}) => {
  const courseList = enrolledCourses.map(courseObj => courseObj.course[0])
                                          .sort((a, b) => a > b ? -1 : a > b ? 1 : 0)


  const listItems = courseList.map((c, i) => {
    const courseName = `${c.name} ${c.number} ${CLASS_TYPES[c.sectionCode.toLowerCase()]}`
    const notExamDays = c.schedules.filter(s => !s.isExam)
    const schedule = notExamDays.map(s => <ScheduleLine schedule={s} />)
    return (
      <div key={i}>
        <p>{courseName}</p>
        {schedule}
        <hr />
      </div>
    )
  })
  return (
    <div>
      {listItems}
    </div>
  )
}

_MyCourses.propTypes = {
  courseSchedule: PropTypes.object.isRequired
}

export const MyCourses = Relay.createContainer(_MyCourses, {
  initialVariables: {
    term: calcTerm()
  },
  fragments: {
    courseSchedule: () => Relay.QL`
      fragment on ViewerType {
        enrolledCourses(term: $term) {
          course {
            associatedClass
            canvasCourses
            classStat
            classType
            key
            name
            number
            peopleSoftCode
            section
            sectionCode
            semester
            title
            schedules {
              buildingCode
              campus
              days
              endDate
              endTime
              isExam
              roomNumber
              startDate
              startTime
            }
          }
        }
      }
    `
  }
})
