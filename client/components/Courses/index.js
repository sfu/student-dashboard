import { default as React, PropTypes } from 'react'
import Relay from 'react-relay'
import { Widget } from 'components/Widget'
import { MyCourses } from 'components/MyCourses'

const _Courses = ({viewer}) => {
  return(
    <Widget title="My Courses">
      <MyCourses courseSchedule={viewer} />
    </Widget>
  )
}

_Courses.propTypes = {
  viewer: PropTypes.object
}

export const Courses = Relay.createContainer(_Courses, {
  fragments: {
    viewer: () => Relay.QL`
      fragment viewer on ViewerType {
        ${MyCourses.getFragment('courseSchedule')}
      }
    `
  }
})
