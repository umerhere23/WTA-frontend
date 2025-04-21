import React, { useState, useEffect } from 'react';
import styles from './EngagementModal.module.css';

const EngagementModal = ({ onClose, onSave, data }) => {
  const [form, setForm] = useState({
    employeeName: '',
    department: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    supervisor: '',
    deptManagerEmail: '',
    hrContactEmail: '',
    status: 'Active',
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    onSave({ ...form, id: data?.id });
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>{data ? 'Edit Engagement' : 'New Engagement'}</h3>
        <div className={styles.formGroup}>
          <label>Employee Name</label>
          <input name="employeeName" value={form.employeeName} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Department</label>
          <input name="department" value={form.department} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Job Title</label>
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Supervisor</label>
          <input name="supervisor" value={form.supervisor} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Dept. Manager Email</label>
          <input name="deptManagerEmail" value={form.deptManagerEmail} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>HR Contact Email</label>
          <input name="hrContactEmail" value={form.hrContactEmail} onChange={handleChange} />
        </div>
        <div className={styles.buttons}>
          <button onClick={handleSubmit}>Save</button>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EngagementModal;
