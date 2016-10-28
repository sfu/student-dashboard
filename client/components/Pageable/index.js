import { default as React, PropTypes } from 'react'
import PagerDots from 'components/PagerDots'
import styles from './Pageable.css'

export default React.createClass({
  propTypes: {
    children: PropTypes.element.isRequired,
    pagerTitles: PropTypes.array.isRequired,
    pageCount: PropTypes.number.isRequired,
    startAtPage: PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      currentPage: this.props.startAtPage
    }
  },

  setPage(page) {
    this.setState({
      currentPage: page
    })
  },

  render() {
    const {children, pagerTitles, pageCount} = this.props
    const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, {
        selectedDay: this.state.currentPage,
      })
    )
    return (
      <div>
        <div className={styles.header}>
          <button
            disabled={this.state.currentPage === 0}
            className={styles.pagerButton}
            onClick={() => {this.setPage(this.state.currentPage - 1)}}
            >
              &lt;
            </button>
          <span className={styles.pagerTitle}>{pagerTitles[this.state.currentPage]}</span>
          <button
            disabled={this.state.currentPage === (this.props.pageCount - 1)}
            className={styles.pagerButton}
            onClick={() => {this.setPage(this.state.currentPage + 1)}}
          >
            &gt;
          </button>
        </div>
        {childrenWithProps}
        <PagerDots count={pageCount} activeDot={this.state.currentPage} />
      </div>
    )
  }
})
