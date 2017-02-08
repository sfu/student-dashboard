import React, { PropTypes }  from 'react'
import Relay from 'react-relay'
import ClassSchedule from './ClassSchedule'
import { CLASS_TYPES } from 'const'
import calcTermForDate from 'utils/calcTermForDate'
import previousOrNextTerm from 'utils/previousOrNextTerm'
import termNameForCode from 'utils/termNameForCode'
import Swipeable from 'components/Swipeable'
import PagerHeader from 'components/PagerHeader'
import PagerDots from 'components/PagerDots'
import Loading from 'components/Loading'
import RelayFetchError from 'components/RelayFetchError'

import styles from './MyCourses.css'

export const _MyCourses = React.createClass({
  propTypes: {
    courseSchedule: PropTypes.object.isRequired,
    term: PropTypes.string,
    relay: PropTypes.object.isRequired,
    gaCategory: PropTypes.string
  },

  getInitialState() {
    return {
      currentPage: 1,
      currentTerm: calcTermForDate(),
      fetching: false,
      error: false
    }
  },

  termCodes: [
    previousOrNextTerm(calcTermForDate(), 'PREV'),
    calcTermForDate(),
    previousOrNextTerm(calcTermForDate(), 'NEXT'),
  ],

  buttonHandler(nextPage) {
    const nextTerm = this.termCodes[nextPage]
    this.setState({
      currentPage: nextPage,
      currentTerm: nextTerm,
      fetching: true
    }, () => {
      this.props.relay.setVariables({
        term: this.state.currentTerm
      }, ({ done, error, ready }) => {
        if (done && ready && !error) {
          this.setState({ fetching: false, error: null })
        } else if (error) {
          this.setState({
            fetching: false,
            error
          })
        }
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
          <h2 className={styles.className}>{courseName}</h2>
          <h3 className={styles.classTitle}>{c.title}</h3>
          {schedule}
        </div>
      )
    })

    const classList = listItems.length ? listItems :
      <p className={styles.noClasses}>No classes scheduled this term</p>

    const getContent = () => {
      if (this.state.fetching) {
        return <Loading />
      } else if (this.state.error) {
        return (
          <RelayFetchError
            error={this.state.error}
          />
        )
      } else {
        return classList
      }
    }
    const backDisabled = this.state.currentPage === 0
    const forwardDisabled = this.state.currentPage === 2
    return (
      <Swipeable
        currentPage={this.state.currentPage}
        forwardDisabled={forwardDisabled}
        backDisabled={backDisabled}
        swipeHandler={this.buttonHandler}
        gaCategory={this.props.gaCategory}
      >
        <div className={styles.myCourses}>
          <PagerHeader
            title={termNameForCode(this.state.currentTerm)}
            currentPage={this.state.currentPage}
            buttonHandler={this.buttonHandler}
            backDisabled={this.state.currentPage === 0}
            forwardDisabled={this.state.currentPage === 2}
            gaCategory={this.props.gaCategory}
          />
          <div>
            {getContent()}
          </div>
          <PagerDots
            count={3}
            activeDot={this.state.currentPage}
            dotClickHandler={this.buttonHandler}
            gaCategory={this.props.gaCategory}
          />
        </div>
      </Swipeable>
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
            canvasCourses
            key
            name
            number
            section
            sectionCode
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
