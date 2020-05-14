import React, { PropTypes } from 'react';
import styles from './RelayFetchError.css';

const RelayFetchError = ({ error, retry }) => {
  console.error(error); // eslint-disable-line
  return (
    <div className={styles.fetchError}>
      <h1>Oh, Snap!</h1>
      <p>Something went wrong while fetching your data from the server.</p>
      {retry && (
        <button className={styles.retryButton} onClick={retry}>
          Try Again
        </button>
      )}
    </div>
  );
};

RelayFetchError.defaultProps = {
  retry: null,
};

RelayFetchError.propTypes = {
  error: PropTypes.object.isRequired,
  retry: PropTypes.func,
};

export default RelayFetchError;
