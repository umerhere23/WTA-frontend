import React, { useEffect, useState, useCallback } from 'react';
import request from '../../../../api/request';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { 
  FiBriefcase, 
  FiUser, 
  FiCalendar, 
  FiMail, 
  FiClock,
  FiCheckCircle,
  FiLoader,
  FiChevronRight
} from 'react-icons/fi';
import styles from './Engagements.module.css';

const Engagements = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fetchEngagements = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await request({ 
        url: `/supervisors/sup/${user.id}`, 
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      setEngagements(response.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch engagements';
      toast.error(message);
      setError(message);
      console.error('Fetch engagements error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    fetchEngagements();
  }, [fetchEngagements]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    const badgeClasses = {
      active: `${styles.badge} ${styles.active}`,
      completed: `${styles.badge} ${styles.completed}`,
      pending: `${styles.badge} ${styles.pending}`,
      default: `${styles.badge} ${styles.default}`
    };
    
    const badgeContent = {
      active: <><FiCheckCircle /> Active</>,
      completed: <><FiCheckCircle /> Completed</>,
      pending: <><FiClock /> Pending</>,
      default: <><FiClock /> {status}</>
    };
    
    const selectedType = badgeContent[statusLower] ? statusLower : 'default';
    
    return (
      <span className={badgeClasses[selectedType]}>
        {badgeContent[selectedType]}
      </span>
    );
  };
 
  const openModal = (engagement) => {
    setSelectedEngagement(engagement);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const renderEngagementCard = (engagement) => (
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
      
      <button 
        className={styles.viewButton}
        onClick={() => openModal(engagement)}
      >
        View Details   <FiChevronRight />
      </button>
    </div>
  );

  const renderModalContent = () => {
    if (!selectedEngagement) return <p>No details available.</p>;
    
    const engagement = selectedEngagement;
    const details = [
      { label: 'Employee Name', value: engagement.Employee?.FullName || 'N/A' },
      { label: 'Contact Info', value: engagement.Employee?.ContactInfo || 'N/A' },
      { label: 'Department', value: engagement.Department?.DepartmentName || 'N/A' },
      { label: 'Job Title', value: engagement.JobTitle?.Title || 'N/A' },
      { label: 'Supervisor', value: engagement.Supervisor?.FullName || 'N/A' },
      { label: 'Supervisor Email', value: engagement.Supervisor?.Email || 'N/A' },
      { label: 'Department Manager Email', value: engagement.DeptManagerEmail || 'N/A' },
      { label: 'HR Contact Email', value: engagement.HRContactEmail || 'N/A' },
      { label: 'Status', value: engagement.Status || 'N/A' },
      { label: 'Start Date', value: formatDate(engagement.StartDate) },
      { label: 'End Date', value: formatDate(engagement.EndDate) },
      { label: 'Created At', value: formatDate(engagement.createdAt) },
      { label: 'Updated At', value: formatDate(engagement.updatedAt) }
    ];
    
    return (
      <>
        {details.map((item, index) => (
          <p key={index}>
            <strong>{item.label}:</strong> {item.value}
          </p>
        ))}
      </>
    );
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
      ) : error ? (
        <div className={styles.emptyState}>
          <FiBriefcase className={styles.emptyIcon} />
          <h3>Error Loading Engagements</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={fetchEngagements}
          >
            Retry
          </button>
        </div>
      ) : engagements.length > 0 ? (
        <div className={styles.engagementGrid}>
          {engagements.map(renderEngagementCard)}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FiBriefcase className={styles.emptyIcon} />
          <h3>No Engagements Found</h3>
          <p>You currently don't have any engagements assigned to you.</p>
        </div>
      )}

<div 
  className={`${styles.modal} ${styles.modalFade} ${showModal ? styles.modalShow : ''}`} 
  id="detailsModal" 
  tabIndex="-1" 
  aria-labelledby="detailsModalLabel" 
  aria-hidden={!showModal}
  style={{ display: showModal ? 'block' : 'none' }}
>
  <div className={`${styles.modalDialog} ${styles.modalDialogScrollable}`}>
    <div className={styles.modalContent}>
      <div className={styles.modalHeader}>
        <h5 className={styles.modalTitle} id="detailsModalLabel">Engagement Details</h5>
        <button 
          type="button" 
          className={styles.btnClose} 
          onClick={closeModal}
          aria-label="Close"
        ></button>
      </div>
      <div className={styles.modalBody}>
        {renderModalContent()}
      </div>
      <div className={styles.modalFooter}>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
{showModal && <div className={`${styles.modalBackdrop} ${styles.modalFade} ${styles.modalShow}`}></div>}
     </div>
  );
};

export default Engagements;