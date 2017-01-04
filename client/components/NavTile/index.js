/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions,
  jsx-a11y/onclick-has-role,
  jsx-a11y/onclick-has-focus
*/

import React, { PropTypes }  from 'react'
import ReactGA from 'react-ga'
import { Link } from 'react-router'
import styles from './NavTile.css'

const NavTile = ({LinkTo, Title, Icon, OnlyActiveOnIndex = false, placement }) => {
  const sendEvent = () => {
    ReactGA.event({
      category: `NavTile_${placement}`,
      action: 'click',
      label: LinkTo
    })
  }
  return (
    <div onClick={sendEvent} className={styles.tileContainer}>
      <Link to={LinkTo} activeClassName={styles.active} onlyActiveOnIndex={OnlyActiveOnIndex}>
        <div className={styles.tile}>
          <div className={styles.icon}><Icon /></div>
          <div className={styles.title}>{Title}</div>
        </div>
      </Link>
    </div>
  )
}

NavTile.propTypes = {
  LinkTo: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Icon: PropTypes.func.isRequired,
  OnlyActiveOnIndex: PropTypes.bool,
  placement: PropTypes.string.isRequired
}

export default NavTile
