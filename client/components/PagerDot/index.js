import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';
import styles from './PagerDot.css';
import cx from 'classnames';

const PagerDot = ({
  active = false,
  idx,
  dotClickHandler,
  gaCategory,
  label,
}) => {
  const className = active ? cx(styles.active, styles.dot) : styles.dot;
  const onClickHandler = (page) => {
    dotClickHandler(page);
    if (gaCategory) {
      ReactGA.event({
        category: gaCategory,
        action: 'change page',
        label: 'PagerDot',
        value: page,
      });
    }
  };
  return (
    <button
      onClick={() => {
        onClickHandler(idx);
      }}
      className={className}
      key={idx}
      name={label}
      aria-label={label}
    >
      <svg height="16px" width="16px">
        <circle cx="8" cy="8" r={active ? 7 : 4} />
      </svg>
    </button>
  );
};

PagerDot.propTypes = {
  active: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
  dotClickHandler: PropTypes.func.isRequired,
  gaCategory: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default PagerDot;
