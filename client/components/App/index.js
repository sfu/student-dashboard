import React, { PropTypes } from 'react';
import Header from 'components/Header';

import 'normalize.css/normalize.css';
import 'styles/global.css';
import styles from './App.css';

const App = ({ children }) => {
  const childProps = children.props.routerProps || children.props;
  const { fullScreen } = childProps.route;
  return (
    <div>
      <div className={styles.app}>
        {fullScreen ? null : <Header title={childProps.route.title} />}
        <div className={fullScreen ? '' : styles.widgets}>{children}</div>
      </div>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;
