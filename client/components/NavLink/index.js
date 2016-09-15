/* eslint jsx-a11y/anchor-has-content: 0 */

import { default as React, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from './NavLink.css'

export const NavLink = (props) => <Link {...props} activeClassName={styles.active} />

NavLink.propTypes = {
  props: PropTypes.object
}
