import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
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
  FiTag,
  FiHome
} from 'react-icons/fi';
import styles from '../Components/DashboardLayout.module.css';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: 'engagements', label: 'Engagements', icon: <FiBriefcase /> },
 
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className={`${styles.dashboardContainer} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      
       {isMobile && (
        <header className={styles.mobileHeader}>
          <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle menu">
            <FiMenu size={24} />
          </button>
          <h1 className={styles.mobileLogo}>Supervisor Portal</h1>
          <div className={styles.mobileUser}><FiUser size={18} /></div>
        </header>
      )}

       <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarFolded : ''}`}>
        
         <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>{sidebarOpen ? 'Supervisor Portal' : 'SR'}</h2>
          <button className={styles.toggleButton} onClick={toggleSidebar} aria-label="Toggle sidebar">
            {sidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>

         <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {(sidebarOpen || !isMobile) && <span className={styles.navLabel}>{item.label}</span>}
              {(sidebarOpen && isActive(item.path)) && <div className={styles.activeIndicator}></div>}
            </Link>
          ))}
        </nav>

         <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}><FiUser size={18} /></div>
            {(sidebarOpen || !isMobile) && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.name}</span>
                <span className={styles.userRole}>{user?.role}</span>
              </div>
            )}
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.navIcon}><FiLogOut /></span>
            {(sidebarOpen || !isMobile) && <span className={styles.navLabel}>Logout</span>}
          </button>
        </div>
      </aside>

       <main className={styles.mainContent}>
        {!isMobile && (
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>
              {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h1>
            <div className={styles.headerActions}>
        
              <div className={styles.userProfile}>
                <div className={styles.profileAvatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{user?.name}</span>
                  <span className={styles.profileRole}>{user?.role}</span>
                </div>
              </div>
            </div>
          </header>
        )}
        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
