import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';

class Swipeable extends React.Component {
  constructor(props) {
    super(props);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.swipePos = {
      startX: null,
      endX: null,
    };
  }

  handleTouchStart(ev) {
    const { touches } = ev;
    this.swipePos.startX = touches[0].screenX;
    this.swipePos.endX = null;
  }

  handleTouchMove(ev) {
    const { touches } = ev;
    this.swipePos.endX = touches[0].screenX;
  }

  handleTouchEnd() {
    const FORWARD = 'forward';
    const BACK = 'back';
    const { startX, endX } = this.swipePos;
    const {
      swipeHandler,
      currentPage,
      gaCategory,
      minSwipe,
      backDisabled,
      forwardDisabled,
    } = this.props;
    const direction = endX > startX ? FORWARD : BACK;
    const distance = Math.abs(startX - endX);
    const nextPage = direction === FORWARD ? currentPage + 1 : currentPage - 1;

    if (distance < minSwipe) {
      return false;
    }
    if (
      (direction === BACK && backDisabled) ||
      (direction === FORWARD && forwardDisabled)
    ) {
      return false;
    }
    if (!endX) {
      return false;
    }

    swipeHandler(nextPage);
    if (gaCategory) {
      ReactGA.event({
        category: gaCategory,
        action: 'change page',
        label: `${direction} swipe`,
        value: nextPage,
      });
    }
  }

  render() {
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        {this.props.children}
      </div>
    );
  }
}

Swipeable.propTypes = {
  children: PropTypes.element.isRequired,
  currentPage: PropTypes.number.isRequired,
  minSwipe: PropTypes.number.isRequired,
  forwardDisabled: PropTypes.bool.isRequired,
  backDisabled: PropTypes.bool.isRequired,
  swipeHandler: PropTypes.func,
  gaCategory: PropTypes.string,
};

Swipeable.defaultProps = {
  minSwipe: 75,
};

export default Swipeable;
