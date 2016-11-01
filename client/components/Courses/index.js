import { default as React, PropTypes } from 'react'
import Relay from 'react-relay'
import { Widget } from 'components/Widget'
import { MyCourses } from 'components/MyCourses'
import calcTermForDate from 'utils/calcTermForDate'

const _Courses = React.createClass({
  propTypes: {
    viewer: PropTypes.object
  },

  render() {
    const {viewer} = this.props
    return (
      <Widget title="My Courses">
        <MyCourses courseSchedule={viewer} term={calcTermForDate()}/>
      </Widget>
    )
  }
})

export const Courses = Relay.createContainer(_Courses, {
  fragments: {
    viewer: () => Relay.QL`
      fragment viewer on ViewerType {
        ${MyCourses.getFragment('courseSchedule', {term: calcTermForDate()})}
      }
    `
  }
})
