import { default as React, PropTypes } from 'react'
import PagerHeader from 'components/PagerHeader'
import PagerDots from 'components/PagerDots'

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
        <PagerHeader
          currentPage={this.state.currentPage}
          title={pagerTitles[this.state.currentPage]}
          backDisabled={this.state.currentPage === 0}
          forwardDisabled={this.state.currentPage === (this.props.pageCount - 1)}
          buttonHandler={this.setPage}
         />
        {childrenWithProps}
        <PagerDots count={pageCount} activeDot={this.state.currentPage} />
      </div>
    )
  }
})
