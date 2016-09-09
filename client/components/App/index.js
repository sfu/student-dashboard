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
    {children}
  </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired
}
