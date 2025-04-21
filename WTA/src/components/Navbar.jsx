import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Navbar.module.css';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
          {user && (
            <>
              <li className={styles.navItem}>
                <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/engagements" className={styles.navLink}>Engagements</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/reports" className={styles.navLink}>Reports</Link>
              </li>
            </>
          )}
          <li className={styles.navItem}>
            {user ? (
              <button
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.loginButton}`}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className={`${styles.navLink} ${styles.loginButton}`}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
