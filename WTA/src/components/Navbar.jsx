import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          NFM Worker Tracker
        </Link>
        <ul className={styles.navLinks}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/engagements" className={styles.navLink}>Engagements</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/reports" className={styles.navLink}>Reports</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/login" className={`${styles.navLink} ${styles.loginButton}`}>Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;