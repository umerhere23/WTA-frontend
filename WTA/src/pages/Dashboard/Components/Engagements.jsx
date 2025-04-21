import React, { useState, useEffect } from 'react';
import styles from './Engagements.module.css';
import EngagementModal from './EngagementModal';
import request from '../../../../api/request';

const Engagements = () => {
  const [engagements, setEngagements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchEngagements = async () => {
    try {
      const response = await request({ method: 'get', url: '/engagements' });
      setEngagements(response.data);
    } catch (error) {
      console.error('Failed to fetch engagements:', error);
    }
  };

  useEffect(() => {
    fetchEngagements();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditData(record);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    console.log("Submitting form data:", formData);

    try {
      if (formData.EngagementID) {
        await request({ method: 'put', url: `/engagements/${formData.EngagementID}`, data: formData });
      } else {
        await request({ method: 'post', url: '/engagements', data: formData });

      }
      fetchEngagements();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving engagement:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Engagements</h2>
        <button className={styles.addButton} onClick={handleAdd}>+ Add Engagement</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Job Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Supervisor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {engagements.map((e) => (
            <tr key={e.EngagementID}>
              <td>{e.Employee?.FullName}</td>
              <td>{e.Department?.DepartmentName}</td>
              <td>{e.JobTitle?.Title}</td>
              <td>{e.StartDate}</td>
              <td>{e.EndDate || '—'}</td>
              <td>{e.Status}</td>
              <td>{e.Supervisor?.FullName}</td>
              <td>
                <button className={styles.editBtn} onClick={() => handleEdit(e)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <EngagementModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          data={editData}
        />
      )}
    </div>
  );
};

export default Engagements;