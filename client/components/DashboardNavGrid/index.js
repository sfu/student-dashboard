import React from 'react';
import NavGrid from 'components/NavGrid';
import styles from './DashboardNavGrid.css';

const HeaderNavGrid = () => {
  return (
    <div className={styles.container}>
      <NavGrid placement="Dashboard" />
    </div>
  );
};

export default HeaderNavGrid;
