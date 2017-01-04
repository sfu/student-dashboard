import React, { PropTypes }  from 'react'
import { Link } from 'react-router'
import ReactGA from 'react-ga'

export const RoomFinderLink = ({building, room}) =>
  <Link
    to={{
      pathname: '/room_finder',
      query: { building, room }
    }}
    onClick={(ev) => {
      ev.stopPropagation()
      ReactGA.event({
        category: 'RoomFinderLink',
        action: 'click',
        label: `${building}_${room}`
      })
    }}
  >
    {building} {room}
  </Link>


RoomFinderLink.propTypes = {
  building: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired
}
