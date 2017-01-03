import React, { PropTypes }  from 'react'
import { OutboundLink } from 'react-ga'
import styles from './MyLibrary.css'

const MyLibrary = ({barcode, fines, checkedOut, holds}) => {
  const checkedOutItemsList = checkedOut.map((item, index) =>
    <li className={styles.listItem} key={index}>
      <OutboundLink
        eventLabel={item.link}
        to={item.link}
      >
        {item.title}
      </OutboundLink>
      <br/>
      <span className={styles.due}>Due {item.due_printable}</span>
    </li>
  )
  const checkedOutItems = (<ul className={styles.list}>{checkedOutItemsList}</ul>)

  const holdItemsList = holds.map((item, index) => (
    <li className={styles.listItem} key={index}>
      <OutboundLink
        eventLabel={item.link}
        to={item.link}
      >
        {item.title}
      </OutboundLink>
      <br/>
      <span>Status: {item.status}</span><br/>
      <span>Pickup: {item.pickup}</span>
    </li>
  ))

  const holdItems = (<ul className={styles.list}>{holdItemsList}</ul>)

  return (
    <div className={styles.myLibrary}>
      {fines !== '0.00' ? <h3 className={styles.h3}>Current Fines: ${fines}</h3> : null}

      {barcode &&
        <div>
          <h3 className={styles.h3}>Library Barcode</h3>
          <p className={styles.p}>{barcode}</p>
        </div>
      }

      <h3 className={styles.h3}>Items Checked Out</h3>
      {checkedOut.length ? checkedOutItems : <p className={styles.p}>You have nothing checked out.</p>}

      <h3 className={styles.h3}>Hold Requests</h3>
      {holds.length ? holdItems : <p className={styles.p}>You have no hold requests.</p>}
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
