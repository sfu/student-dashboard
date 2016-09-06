import {default as React, PropTypes} from 'react'
import logo from './sfusnap_white.png'
import styles from './Splash.css'

export const Splash = ({children}) => {
  return (
    <div className={styles.splash}>
      <img alt="SFU Snap" src={logo} className={styles.logo}/>
      {children}
    </div>
  )
}

Splash.propTypes = {
  children: PropTypes.array
}
