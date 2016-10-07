import React from 'react'
import { NavLink } from 'components/NavLink'
import styles from './NavBar.css'

export const NavBar = () => (
  <nav className={styles.navbar} >
  <ul>
    <li><NavLink onlyActiveOnIndex={true} to="/">Dashboard</NavLink></li>
    <li><NavLink to="/courses">Courses</NavLink></li>
    <li><NavLink to="/transit">Transit</NavLink></li>
    <li><NavLink to="/library">Library</NavLink></li>
    <li><NavLink to="/room_finder">Room Finder</NavLink></li>
  </ul>
  </nav>
)

NavBar.propTypes = {}
