import React, { PropTypes }  from 'react'
import PagerDot from 'components/PagerDot'
import styles from './PagerDots.css'

const PagerDots = ({ count, activeDot, dotClickHandler }) => {
  const dots = [...Array(count).keys()].map((arr, idx) => {
    return (
      <PagerDot dotClickHandler={dotClickHandler} active={idx === activeDot} idx={idx} key={idx} />
    )
  })

  return (
    <div className={styles.pagerDots}>
      {dots}
    </div>
  )
}

PagerDots.propTypes = {
  count: PropTypes.number.isRequired,
  activeDot: PropTypes.number.isRequired,
  dotClickHandler: PropTypes.func.isRequired
}

export default PagerDots
