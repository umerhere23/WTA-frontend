import React, { useEffect, useState } from 'react';
import request from '../../../../api/request';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiBriefcase, 
  FiUser, 
  FiCalendar, 
  FiMail, 
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiChevronRight
} from 'react-icons/fi';
import styles from './Engagements.module.css';

const Engagements = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEngagements = async () => {
      setLoading(true);
      try {
        const response = await request({ url: `/supervisors/sup/${user?.id}`, method: 'GET' });
        setEngagements(response.data || []);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch engagements';
        toast.error(message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEngagements();
    }
  }, [user?.id, token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return <span className={`${styles.badge} ${styles.active}`}><FiCheckCircle /> Active</span>;
      case 'completed':
        return <span className={`${styles.badge} ${styles.completed}`}><FiCheckCircle /> Completed</span>;
      case 'pending':
        return <span className={`${styles.badge} ${styles.pending}`}><FiClock /> Pending</span>;
      default:
        return <span className={`${styles.badge} ${styles.default}`}><FiClock /> {status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FiBriefcase className={styles.titleIcon} /> 
          My Engagements
        </h1>
        {engagements.length > 0 && (
          <div className={styles.stats}>
            <span className={styles.statItem}>
              <span className={styles.statNumber}>{engagements.length}</span>
              <span className={styles.statLabel}>Total</span>
            </span>
            <span className={styles.statItem}>
              <span className={styles.statNumber}>
                {engagements.filter(e => e.Status?.toLowerCase() === 'active').length}
              </span>
              <span className={styles.statLabel}>Active</span>
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <FiLoader className={styles.spinner} />
          <p>Loading engagements...</p>
        </div>
      ) : engagements.length > 0 ? (
        <div className={styles.engagementGrid}>
          {engagements.map((engagement) => (
            <div key={engagement?.EngagementID} className={styles.engagementCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.engagementTitle}>
                  {engagement?.Employee?.FullName || 'Unnamed Engagement'}
                </h3>
                {getStatusBadge(engagement?.Status)}
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <FiBriefcase className={styles.infoIcon} />
                  <span>{engagement?.JobTitle?.Title || 'N/A'}</span>
                </div>
                
                <div className={styles.infoRow}>
                  <FiUser className={styles.infoIcon} />
                  <span>Supervisor: {engagement?.Supervisor?.FullName || 'N/A'}</span>
                </div>
                
                <div className={styles.infoRow}>
                  <FiMail className={styles.infoIcon} />
                  <span>{engagement?.Supervisor?.Email || 'N/A'}</span>
                </div>
                
                <div className={styles.datesContainer}>
                  <div className={styles.dateItem}>
                    <FiCalendar className={styles.infoIcon} />
                    <div>
                      <div className={styles.dateLabel}>Start Date</div>
                      <div className={styles.dateValue}>{formatDate(engagement?.StartDate)}</div>
                    </div>
                  </div>
                  
                  <div className={styles.dateItem}>
                    <FiCalendar className={styles.infoIcon} />
                    <div>
                      <div className={styles.dateLabel}>End Date</div>
                      <div className={styles.dateValue}>{formatDate(engagement?.EndDate)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className={styles.viewButton}>
                View Details <FiChevronRight />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FiBriefcase className={styles.emptyIcon} />
          <h3>No Engagements Found</h3>
          <p>You currently don't have any engagements assigned to you.</p>
        </div>
      )}
    </div>
  );
};

export default Engagements;