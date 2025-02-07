import React from 'react';
import { FourSquare, OrbitProgress, Riple } from 'react-loading-indicators';
import styles from './styles/Load.module.scss';

function Load() {
  return (
    <div className={styles.wrapper}>
      <OrbitProgress color="#20aef3" size="small" text="" textColor="" />
    </div>
  );
}

export default Load;
