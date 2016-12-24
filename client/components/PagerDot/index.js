import React, { PropTypes }  from 'react'
import GAEvent from 'utils/GAEvent'
import styles from './PagerDot.css'
import cx from 'classnames'

const PagerDot = ({ active = false, idx, dotClickHandler, gaCategory }) => {
  const className = active ? cx(styles.active, styles.dot) : styles.dot
  const onClickHandler = page => {
    dotClickHandler(page)
    if (gaCategory) {
      GAEvent({
        category: gaCategory,
        action: 'change page',
        label: 'PagerDot',
        value: page
      })
    }
  }
  return (
    <button onClick={() => {onClickHandler(idx)}} className={className} key={idx}>
      <svg height="16px" width="16px">
        <circle cx="8" cy="8" r={active ? 8 : 4} />
      </svg>
    </button>
  )
}

PagerDot.propTypes = {
  active: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
  dotClickHandler: PropTypes.func.isRequired,
  gaCategory: PropTypes.string
}

export default PagerDot
