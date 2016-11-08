import { default as React, PropTypes } from 'react'
import Relay from 'react-relay'
import ClassSchedule from './ClassSchedule'
import { CLASS_TYPES } from 'const'
import calcTermForDate from 'utils/calcTermForDate'
import previousOrNextTerm from 'utils/previousOrNextTerm'
import termNameForCode from 'utils/termNameForCode'
import PagerHeader from 'components/PagerHeader'
import PagerDots from 'components/PagerDots'

import styles from './MyCourses.css'

export const _MyCourses = React.createClass({
  propTypes: {
    courseSchedule: PropTypes.object.isRequired,
    term: PropTypes.string,
    relay: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      currentPage: 1,
      currentTerm: calcTermForDate()
    }
  },

  termCodes: [
    previousOrNextTerm(calcTermForDate(), 'PREV'),
    calcTermForDate(),
    previousOrNextTerm(calcTermForDate(), 'NEXT'),
  ],

  buttonHandler(page) {
    this.setState({
      currentPage: page,
      currentTerm: this.termCodes[page]
    }, () => {
      this.props.relay.setVariables({
        term: this.state.currentTerm
      })
    })
  },

  render() {
    const { enrolledCourses } = this.props.courseSchedule
    const courseList = enrolledCourses.map(courseObj => courseObj.course[0])
      .sort((a, b) => a > b ? -1 : a > b ? 1 : 0)

    const listItems = courseList.map((c, i) => {
      const courseName = `${c.name} ${c.number} ${CLASS_TYPES[c.sectionCode.toLowerCase()]}`
      const notExamDays = c.schedules.filter(s => !s.isExam)
      const schedule = notExamDays.map((s, i) => <ClassSchedule key={i} schedule={s} />)
      return (
        <div className={styles.classItem} key={i}>
          <h2 className={styles.classTitle}>{courseName}</h2>
          {schedule}
        </div>
      )
    })

    return (
      <div className={styles.myCourses}>
        <PagerHeader
          title={termNameForCode(this.state.currentTerm)}
          currentPage={this.state.currentPage}
          buttonHandler={this.buttonHandler}
          backDisabled={this.state.currentPage === 0}
          forwardDisabled={this.state.currentPage === 2}
        />
        <div>
          {listItems.length ? listItems : <p className={styles.noClasses}>No classes scheduled this term</p>}
        </div>
        <PagerDots
          count={3}
          activeDot={this.state.currentPage}
          dotClickHandler={this.buttonHandler}
        />
      </div>
    )

  }
})

export const MyCourses = Relay.createContainer(_MyCourses, {
  initialVariables: {
    term: ''
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
