import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FiMenu, 
  FiX,
  FiBriefcase, 
  FiBell, 
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { path: 'engagements', label: 'Engagements', icon: <FiBriefcase /> },
    { path: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { path: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
  ];

  return (
    <div className={`${styles.dashboardContainer} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className={styles.mobileLogo}>HR Panel</h1>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>
            {sidebarOpen ? 'HR Panel' : 'HR'}
          </h2>
          <button 
            className={styles.toggleButton} 
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname.includes(item.path) ? styles.active : ''
              }`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/profile" className={styles.navItem}>
            <span className={styles.navIcon}><FiUser /></span>
            {sidebarOpen && <span className={styles.navLabel}>Profile</span>}
          </Link>
          <Link to="/logout" className={styles.navItem}>
            <span className={styles.navIcon}><FiLogOut /></span>
            {sidebarOpen && <span className={styles.navLabel}>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Welcome, HR User</h1>
          <div className={styles.userProfile}>
            <FiUser size={20} />
            <span>John Doe</span>
          </div>
        </header>
        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;