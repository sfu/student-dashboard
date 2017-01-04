import React from 'react'
import NavGrid from 'components/NavGrid'
import styles from './HeaderNavGrid.css'

const HeaderNavGrid = () => {
  return (
    <div className={styles.container}>
      <NavGrid placement="Header" />
    </div>
  )
}

export default HeaderNavGrid
