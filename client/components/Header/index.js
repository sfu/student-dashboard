import { default as React, PropTypes } from 'react'
import snapLogo from './sfusnap.png'
import menu from './menu.svg'
import styles from './Header.css'

export const Header = ({title}) => {
  return (
    <header className={styles.header}>
      <img alt="SFU Snap Logo" src={snapLogo} height={50} width={50} />
      <h1 className={styles.title}>{title}</h1>
      <img alt="menu" src={menu} />
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired
}
