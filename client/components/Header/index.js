import { default as React, PropTypes } from 'react'
import HeaderNavGrid from 'components/HeaderNavGrid'
import LogoutButton from 'components/LogoutButton'
import Collapse from 'react-collapse'
import { presets } from 'react-motion'
import snapLogo from './sfusnap_white.png'
import Menu from './menu.svg'
import styles from './Header.css'
import cx from 'classnames'

export const Header = ({ title, showNav, toggleHeaderNav }) => {
  const menuToggleClassNames = showNav ? cx(styles.navToggle, styles.navToggleActive) : styles.navToggle
  return (
    <div className={styles.headerContainer}>
      <header className={styles.header}>
        <img className={styles.snapLogo} alt="SFU Snap Logo" src={snapLogo} height={50} width={50} />
        <button className={menuToggleClassNames} onClick={toggleHeaderNav}><h1 className={styles.title}>{title}</h1></button>
        <button type="button" name="Toggle Menu" className={menuToggleClassNames} onClick={toggleHeaderNav}>
          <Menu />
        </button>
      </header>

      <Collapse
        isOpened={showNav}
        springConfig={presets.stiff}
      >
        <HeaderNavGrid />
        <LogoutButton />
      </Collapse>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  showNav: PropTypes.bool.isRequired,
  toggleHeaderNav: PropTypes.func.isRequired
}
