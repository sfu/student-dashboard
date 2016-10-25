import { default as React, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from './NavTile.css'

const NavTile = ({LinkTo, Title, Icon}) => {
  return (
    <div className={styles.tileContainer}>
      <Link to={LinkTo}>
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
  Icon: PropTypes.func.isRequired
}

export default NavTile
