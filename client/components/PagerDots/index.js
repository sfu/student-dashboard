import React, { PropTypes }  from 'react'
import PagerDot from 'components/PagerDot'
import { DAYS_OF_WEEK } from 'const'
import styles from './PagerDots.css'

const PagerDots = ({ count, activeDot, dotClickHandler, gaCategory }) => {
  const dots = [...Array(count).keys()].map((arr, idx) => {
    return (
      <PagerDot
        dotClickHandler={dotClickHandler}
        active={idx === activeDot}
        idx={idx}
        key={idx}
        gaCategory={gaCategory}
        label={DAYS_OF_WEEK[idx]}
      />
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
  dotClickHandler: PropTypes.func.isRequired,
  gaCategory: PropTypes.string
}

export default PagerDots
