import {default as React, PropTypes} from 'react'

import {Header} from 'components/Header'
import {Link} from 'react-router'
import 'normalize.css/normalize.css'
import 'styles/global.css'
import styles from './App.css'


export const App = ({children}) => {
  return (
  <div className={styles.app}>
    <Header />
    <ul>
      <li><Link to="/">Dashboard</Link></li>
      <li><Link to="/courses">Courses</Link></li>
      <li><Link to="/transit">Transit</Link></li>
      <li><Link to="/library">Library</Link></li>
      <li><Link to="/room_finder">Room Finder</Link></li>
    </ul>
    <div className={styles.widgets}>
      {children}
    </div>
  </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired
}
