import React, { PropTypes }  from 'react'
import styles from './RoomFinder.css'
import url from 'url'

const RoomFinder = ({location: {query: {building, room}}}) => {
  const roomFinderUrl = url.parse(process.env.ROOMFINDER_URL)
  roomFinderUrl.query = {}
  if (building) { roomFinderUrl.query.sims_building = building }
  if (room) { roomFinderUrl.query.sims_room = room }

  return (
    <div>
      <iframe
        className={styles.roomFinder}
        src={roomFinderUrl.format()}
      />
    </div>
  )
}

RoomFinder.propTypes = {
  location: PropTypes.object,
}

export default RoomFinder
