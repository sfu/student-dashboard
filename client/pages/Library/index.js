import React, { PropTypes }  from 'react'
import Relay from 'react-relay'
import { Widget } from 'components/Widget'
import LibaryHours from 'components/LibraryHours'
import MyLibrary from 'components/MyLibrary'
import styles from './Library.css'
const _Library = React.createClass({
  propTypes: {
    viewer: PropTypes.object
  },

  render() {
    const { barcode, library } = this.props.viewer
    return (
      <div className={styles.library}>
        <Widget title="Library Hours">
          <LibaryHours />
        </Widget>
        <Widget title="My Library">
          <MyLibrary
            barcode={barcode}
            fines={library.fines}
            checkedOut={library.checked_out}
            holds={library.holds}
          />
        </Widget>
      </div>
    )

  }
})

export default Relay.createContainer(_Library, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on ViewerType {
        barcode
        library {
          fines
          checked_out {
            title
            link
            due
            due_printable
          }
          holds {
            title
            link
            status
            pickup
          }
        }
      }
    `
  }
})
