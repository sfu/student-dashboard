import React, { PropTypes } from 'react'
import LoadingSpinnerIcon from 'components/LoadingSpinnerIcon'
import styles from './Loading.css'

const Loading = ({ title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <LoadingSpinnerIcon />
      </div>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}

Loading.propTypes = {
  title: PropTypes.string.isRequired
}

Loading.defaultProps = {
  title: 'Fetching data…'
}

export default Loading
