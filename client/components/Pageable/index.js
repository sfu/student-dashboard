import React, { PropTypes }  from 'react'
import Swipeable from 'components/Swipeable'
import PagerHeader from 'components/PagerHeader'
import PagerDots from 'components/PagerDots'

const Pageable = React.createClass({
  propTypes: {
    children: PropTypes.element.isRequired,
    pagerTitles: PropTypes.array.isRequired,
    pageCount: PropTypes.number.isRequired,
    startAtPage: PropTypes.number.isRequired,
    gaCategory: PropTypes.string
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
    const {children, pagerTitles, pageCount, gaCategory} = this.props
    const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, {
        selectedDay: this.state.currentPage,
      })
    )
    const backDisabled = this.state.currentPage === 0
    const forwardDisabled = this.state.currentPage === (this.props.pageCount - 1)
    return (
      <Swipeable
        currentPage={this.state.currentPage}
        forwardDisabled={forwardDisabled}
        backDisabled={backDisabled}
        swipeHandler={this.setPage}
        gaCategory={gaCategory}
      >
        <div>
          <PagerHeader
            currentPage={this.state.currentPage}
            title={pagerTitles[this.state.currentPage]}
            backDisabled={backDisabled}
            forwardDisabled={forwardDisabled}
            buttonHandler={this.setPage}
            gaCategory={gaCategory}
           />
          {childrenWithProps}
          <PagerDots
            count={pageCount}
            activeDot={this.state.currentPage}
            dotClickHandler={this.setPage}
            gaCategory={gaCategory}
          />
        </div>
      </Swipeable>
    )
  }
})

export default Pageable
