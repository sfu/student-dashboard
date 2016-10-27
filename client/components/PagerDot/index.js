import {default as React, PropTypes} from 'react'
import styles from './PagerDot.css'
import cx from 'classnames'

const PagerDot = ({active = false, idx}) => {
  const className = active ? cx(styles.active, styles.dot) : styles.dot
  return (
    <div className={className} key={idx}>
      <svg height="16px" width="16px">
        <circle cx="8" cy="8" r={active ? 8 : 4} />
      </svg>
    </div>
  )
}

PagerDot.propTypes = {
  active: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired
}

export default PagerDot
