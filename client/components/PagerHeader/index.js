import React, { PropTypes }  from 'react'
import ReactGA from 'react-ga'
import styles from './PagerHeader.css'

const PagerHeader = ({
  title,
  forwardDisabled,
  backDisabled,
  buttonHandler,
  currentPage,
  gaCategory
}) => {
  const onClickHandler = (page, direction) => {
    buttonHandler(page)
    if (gaCategory) {
      ReactGA.event({
        category: gaCategory,
        action: 'change page',
        label: `${direction} button`,
        value: page
      })
    }
  }

  return (
    <div className={styles.header}>
      <button
        disabled={backDisabled}
        className={styles.pagerButton}
        onClick={() => {onClickHandler(currentPage - 1, 'back')}}
        >
          &lt;
        </button>
      <span className={styles.pagerTitle}>{title}</span>
      <button
        disabled={forwardDisabled}
        className={styles.pagerButton}
        onClick={() => {onClickHandler(currentPage + 1, 'forward')}}
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
  currentPage: PropTypes.number.isRequired,
  gaCategory: PropTypes.string
}

export default PagerHeader
