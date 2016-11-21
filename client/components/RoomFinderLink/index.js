import React, { PropTypes }  from 'react'
import { Link } from 'react-router'

export const RoomFinderLink = ({building, room}) =>
  <Link
    to={{
      pathname: '/room_finder',
      query: { building, room }
    }}
  >
    {building} {room}
  </Link>


RoomFinderLink.propTypes = {
  building: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired
}
