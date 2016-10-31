import { default as React, PropTypes } from 'react'
import Relay from 'react-relay'
import calcTerm from 'utils/calcTerm'
import ClassSchedule from './ClassSchedule'
import { CLASS_TYPES } from 'const'

import styles from './MyCourses.css'

export const _MyCourses = ({courseSchedule: { enrolledCourses }}) => {
  const courseList = enrolledCourses.map(courseObj => courseObj.course[0])
    .sort((a, b) => a > b ? -1 : a > b ? 1 : 0)

  const listItems = courseList.map((c, i) => {
    const courseName = `${c.name} ${c.number} ${CLASS_TYPES[c.sectionCode.toLowerCase()]}`
    const notExamDays = c.schedules.filter(s => !s.isExam)
    const schedule = notExamDays.map((s, i) => <ClassSchedule key={i} schedule={s} />)
    return (
      <div key={i}>
        <h2 className={styles.classTitle}>{courseName}</h2>
        {schedule}
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
