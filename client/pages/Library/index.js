import React from 'react'
import { Widget } from 'components/Widget'
import LibaryHours from 'components/LibraryHours'
import MyLibrary from 'components/MyLibrary'
import styles from './Library.css'

const Library = () => {
  return (
    <div className={styles.library}>
      <Widget title="Library Hours">
        <LibaryHours />
      </Widget>
      <Widget title="My Library">
        <MyLibrary />
      </Widget>
    </div>
  )
}

export default Library
