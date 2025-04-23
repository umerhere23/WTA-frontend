import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiMenu, 
  FiX,
  FiBriefcase, 
  FiBell, 
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,  
  FiArchive,  
  FiTag  
} from 'react-icons/fi';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  console.log("--->", user)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { path: 'engagements', label: 'Engagements', icon: <FiBriefcase /> },
    { path: 'add-user', label: 'Add Users', icon: <FiBell /> },
    { path: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
    { path: 'add-employee', label: 'Add Employee', icon: <FiUsers /> },  
    { path: 'add-department', label: 'Add Department', icon: <FiArchive /> },  
    { path: 'add-job', label: 'Add Job Role', icon: <FiTag /> },  
  ];

  return (
    <div className={`${styles.dashboardContainer} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <header className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className={styles.mobileLogo}>HR Panel</h1>
      </header>

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
              className={`${styles.navItem} ${location.pathname.includes(item.path) ? styles.active : ''}`}
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

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Welcome, {user?.role}</h1>
          <div className={styles.userProfile}>
            <FiUser size={20} />
            <span>{user?.name}</span>
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
