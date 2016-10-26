import React from 'react'
import NavTile from 'components/NavTile'

import styles from './NavGrid.css'
import DashboardIcon from 'components/NavIcons/Dashboard.svg'
import CoursesIcon from 'components/NavIcons/Courses.svg'
import LibraryIcon from 'components/NavIcons/Library.svg'
import RoomFinderIcon from 'components/NavIcons/RoomFinder.svg'
import TransitIcon from 'components/NavIcons/Transit.svg'
import SettingsIcon from 'components/NavIcons/Settings.svg'

const NavGrid = React.createClass({
  render() {
    return (
      <div className={styles.grid}>
        <NavTile
          LinkTo="/"
          Title="Dashboard"
          Icon={DashboardIcon}
          OnlyActiveOnIndex={true}
        />

        <NavTile
          LinkTo="/courses"
          Title="Courses"
          Icon={CoursesIcon}
        />

        <NavTile
          LinkTo="/library"
          Icon={LibraryIcon}
          Title="Library"
        />

        <NavTile
          LinkTo="/room_finder"
          Icon={RoomFinderIcon}
          Title="Room Finder"
        />

        <NavTile
          LinkTo="/transit"
          Icon={TransitIcon}
          Title="Transit"
        />

        <NavTile
          LinkTo="/settings"
          Icon={SettingsIcon}
          Title="Settings"
        />
      </div>
    )
  }
})

export default NavGrid
