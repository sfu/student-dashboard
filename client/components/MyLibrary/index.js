import { default as React, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from './MyLibrary.css'

const MyLibrary = ({barcode, fines, checkedOut, holds, ...props}) => {
  const checkedOutItemsList = checkedOut.map((item, index) => <li key={index}><a href={item.link}>{item.title}</a><br/>Due: {item.due_printable}</li>)
  const checkedOutItems = (<ul>{checkedOutItemsList}</ul>)

  const holdItemsList = checkedOut.map((item, index) => (
    <li key={index}>
      <a href={item.link}>{item.title}</a><br/>
      Due: {item.due_printable}
    </li>
  ))

  const holdItems = (<ul>{holdItemsList}</ul>)

  return (
    <div className={styles.myLibrary}>
      {fines !== '0.00' ? <h3 className={styles.h3}>Current Fines: ${fines}</h3> : null}

      <h3 className={styles.h3}>Library Barcode</h3>
      <Link to={`/library/barcode`}><p className={styles.p}>{barcode}</p></Link>

      <h3 className={styles.h3}>Items Checked Out</h3>
      {checkedOut.length ? checkedOutItems : <p className={styles.p}>You have nothing checked out.</p>}

      <h3 className={styles.h3}>Hold Requests</h3>
      {holds.length ? holdItems : <p className={styles.p}>You have no hold requests.</p>}
      {props.children}
    </div>
  )
}

MyLibrary.propTypes = {
  fines: PropTypes.string,
  barcode: PropTypes.string,
  checkedOut: PropTypes.array,
  holds: PropTypes.array
}

export default MyLibrary
