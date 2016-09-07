import {default as React, PropTypes} from 'react'
import styles from './WeekAtAGlance.css'
import cx from 'classnames'

const Dot = ({active}) => {
  const classNames = active ? cx(styles.dot, styles['dot-active']) : styles.dot
  return (
    <span className={classNames}>•</span>
  )
}

Dot.propTypes = {
  active: PropTypes.bool
}

const Dots = ({count, activeDot}) => {
  const dots = [...Array(count).keys()].map((arr, idx) => {
    return <Dot key={idx} active={activeDot === idx} />
  })

  return (
    <div className={styles.dots}>
      {dots}
    </div>
  )
}

Dots.propTypes = {
  count: PropTypes.number.isRequired,
  activeDot: PropTypes.number
}

export default Dots
