import React, { PropTypes } from 'react'
import NavTile from 'components/NavTile'

import styles from './NavGrid.css'
import DashboardIcon from 'components/NavIcons/Dashboard.svg'
import CoursesIcon from 'components/NavIcons/Courses.svg'
import LibraryIcon from 'components/NavIcons/Library.svg'
import RoomFinderIcon from 'components/NavIcons/RoomFinder.svg'
import TransitIcon from 'components/NavIcons/Transit.svg'
import SettingsIcon from 'components/NavIcons/Settings.svg'

const NavGrid = ({ placement }) => {
  return (
    <div className={styles.grid}>
      <NavTile
        LinkTo="/"
        Title="Dashboard"
        Icon={DashboardIcon}
        OnlyActiveOnIndex={true}
        placement={placement}
      />

      <NavTile
        LinkTo="/courses"
        Title="Courses"
        Icon={CoursesIcon}
        placement={placement}
      />

      <NavTile
        LinkTo="/library"
        Icon={LibraryIcon}
        Title="Library"
        placement={placement}
      />

      <NavTile
        LinkTo="/room_finder"
        Icon={RoomFinderIcon}
        Title="Room Finder"
        placement={placement}
      />

      <NavTile
        LinkTo="/transit"
        Icon={TransitIcon}
        Title="Transit"
        placement={placement}
      />

      <NavTile
        LinkTo="/settings"
        Icon={SettingsIcon}
        Title="Settings"
        placement={placement}
      />
    </div>
  )
}

NavGrid.propTypes = {
  placement: PropTypes.string.isRequired
}

export default NavGrid
