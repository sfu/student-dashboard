import React from 'react';
import styles from './LogoutButton.css';

const LogoutButton = () => {
  return (
    <div className={styles.container}>
      <a className={styles.logoutButton} href="/auth/logout">
        Logout
      </a>
    </div>
  );
};

export default LogoutButton;
