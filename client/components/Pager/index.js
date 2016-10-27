import { default as React, PropTypes } from 'react'
import PagerDots from 'components/PagerDots'

export default React.createClass({
  MIN: 0,
  MAX: this.props.count - 1,

  propTypes: {
    activeDot: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      currentActiveDot: this.props.activeDot
    }
  },

  toggler(direction) {
    const { currentActiveDot } = this.state
    const nextSelectedDot = direction === '>' ? currentActiveDot + 1 : currentActiveDot - 1
    if (nextSelectedDot >= this.MIN && nextSelectedDot <= this.MAX) {
      this.setState({
        currentActiveDot: nextSelectedDot
      })
    }
  },

  setActiveDot(index) {
    if (index >= this.MIN && index <= this.MAX) {
      this.setState({
        currentActiveDot: index
      })
    }
  },

  render() {
    return (
      <div>
        <button
          disabled={this.state.currentActiveDot === this.MIN}
          onClick={this.toggler('<')}
        >
          &lt;
        </button>
        <PagerDots
          count={this.props.count}
          activeDot={this.state.currentActiveDot}
          setActiveDotFn={this.setActiveDot}
        />
        <button
          disabled={this.state.currentActiveDot === this.MAX}
          onClick={this.toggler('>')}
        >
          &gt;
        </button>
      </div>
    )
  }
})
