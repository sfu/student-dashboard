import React from 'react';
import { OutboundLink } from 'react-ga';
import styles from './MyLibrary.css';

const MyLibrary = () => {
  return (
    <div className={styles.myLibrary}>
      <p>
        View your SFU Library record on the{' '}
        <OutboundLink
          to="https://sfu-primo.hosted.exlibrisgroup.com/primo-explore/account?vid=SFUL&section=overview&lang=en_US"
          eventLabel="LIBRARY_PATRON"
        >
          Library website.
        </OutboundLink>
      </p>
    </div>
  );
};

export default MyLibrary;
