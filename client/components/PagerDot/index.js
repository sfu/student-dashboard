import React, { PropTypes }  from 'react'
import styles from './PagerDot.css'
import cx from 'classnames'

const PagerDot = ({active = false, idx, dotClickHandler}) => {
  const className = active ? cx(styles.active, styles.dot) : styles.dot
  return (
    <button onClick={() => {dotClickHandler(idx)}} className={className} key={idx}>
      <svg height="16px" width="16px">
        <circle cx="8" cy="8" r={active ? 8 : 4} />
      </svg>
    </button>
  )
}

PagerDot.propTypes = {
  active: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
  dotClickHandler: PropTypes.func.isRequired
}

export default PagerDot
