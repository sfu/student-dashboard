import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import styles from './NavTile.css';

const NavTile = ({
  LinkTo,
  Title,
  Icon,
  OnlyActiveOnIndex = false,
  placement,
}) => {
  const tracker = (ev) => {
    ev.stopPropagation();
    ReactGA.event({
      category: `NavTile_${placement}`,
      action: 'click',
      label: LinkTo,
    });
  };
  return (
    <div className={styles.tileContainer}>
      <Link
        to={LinkTo}
        activeClassName={styles.active}
        onlyActiveOnIndex={OnlyActiveOnIndex}
        onClick={tracker}
      >
        <div className={styles.tile}>
          <div className={styles.icon}>
            <Icon />
          </div>
          <div className={styles.title}>{Title}</div>
        </div>
      </Link>
    </div>
  );
};

NavTile.propTypes = {
  LinkTo: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Icon: PropTypes.func.isRequired,
  OnlyActiveOnIndex: PropTypes.bool,
  placement: PropTypes.string.isRequired,
};

export default NavTile;
