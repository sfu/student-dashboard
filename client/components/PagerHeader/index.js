import {default as React, PropTypes} from 'react'
import styles from './PagerHeader.css'

const PagerHeader = ({
  title,
  forwardDisabled,
  backDisabled,
  buttonHandler,
  currentPage
}) => {
  return (
    <div className={styles.header}>
      <button
        disabled={backDisabled}
        className={styles.pagerButton}
        onClick={() => {buttonHandler(currentPage - 1)}}
        >
          &lt;
        </button>
      <span className={styles.pagerTitle}>{title}</span>
      <button
        disabled={forwardDisabled}
        className={styles.pagerButton}
        onClick={() => {buttonHandler(currentPage + 1)}}
      >
        &gt;
      </button>
    </div>
  )
}

PagerHeader.defaultProps = {
  forwardDisabled: false,
  backDisabled: false
}

PagerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  forwardDisabled: PropTypes.bool.isRequired,
  backDisabled: PropTypes.bool.isRequired,
  buttonHandler: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
}

export default PagerHeader
