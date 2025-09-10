// File: src/components/common/Layout/Layout.jsx

import React from 'react';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  // This is now just a simple wrapper since Header/Footer/Nav are handled in App.jsx
  return (
    <div className={styles.layoutContainer}>
      {children}
    </div>
  );
};

export default Layout;
