import React from 'react'
import Barcode from 'react-barcode'
import { Link } from 'react-router'
import styles from './LibraryBarcode.css'

const LibraryBarcode = React.createClass({
  render() {
    const { barcode } = window.ENV.CURRENT_USER
    return (
      <div className={styles.fullHeight}>
        <nav className={styles.nav}>
          <Link to="/library" className={styles.libraryLink}>&lt; My Library Record</Link>
        </nav>
        <div className={styles.barcode}>
          <Barcode
            value={barcode}
            width={2}
            format="codabar"
            font="monospace"
            displayValue={true}
            textMargin={10}
          />
        </div>
      </div>
    )
  }
})

export { LibraryBarcode }
