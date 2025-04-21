import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiX, FiHome, FiGrid, FiBriefcase, FiFileText, FiLogIn, FiLogOut } from 'react-icons/fi';
import styles from './Navbar.module.css';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>👨‍💼</span>
          <span className={styles.logoText}>NFM Worker Tracker</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>
              <FiHome className={styles.navIcon} />
              <span>Home</span>
            </Link>
          </li>
          {user && (
            <>
              <li className={styles.navItem}>
                <Link to="/dashboard" className={styles.navLink}>
                  <FiGrid className={styles.navIcon} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/engagements" className={styles.navLink}>
                  <FiBriefcase className={styles.navIcon} />
                  <span>Engagements</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/reports" className={styles.navLink}>
                  <FiFileText className={styles.navIcon} />
                  <span>Reports</span>
                </Link>
              </li>
            </>
          )}
          <li className={styles.navItem}>
            {user ? (
              <button
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.loginButton}`}
              >
                <FiLogOut className={styles.navIcon} />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/login" className={`${styles.navLink} ${styles.loginButton}`}>
                <FiLogIn className={styles.navIcon} />
                <span>Login</span>
              </Link>
            )}
          </li>
        </ul>

         <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;