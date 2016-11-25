import React, { PropTypes } from 'react'
import styles from './Loading.css'

const Loading = ({ title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <svg className={styles.circular} viewBox="25 25 50 50">
          <circle className={styles.path} cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
        </svg>
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
