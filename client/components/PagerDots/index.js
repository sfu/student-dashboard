import {default as React, PropTypes} from 'react'
import PagerDot from 'components/PagerDot'
import styles from './PagerDots.css'

const PagerDots = ({ count, activeDot }) => {
  const dots = [...Array(count).keys()].map((arr, idx) => {
    return (
      <PagerDot active={idx === activeDot} key={idx} />
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
  activeDot: PropTypes.number.isRequired
}

export default PagerDots
