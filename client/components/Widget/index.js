import React, { PropTypes }  from 'react'
import styles from './Widget.css'

export const Widget = ({title, children}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.widget}>{children}</div>
    </div>
  )
}

Widget.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
  title: PropTypes.string.isRequired
}
