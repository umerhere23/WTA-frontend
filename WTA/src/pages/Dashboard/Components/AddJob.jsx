import React, { useState, useEffect } from 'react';
import styles from './AddJob.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '../../../../api/request';

const API_URL = '/jobtitles';

const AddJob = () => {
  const [job, setJob] = useState({
    JobTitleID: '',
    Title: '',
    DepartmentID: ''
  });
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await request({
        url: '/departments',
        method: 'GET'
      });
      setDepartments(response.data);
    } catch (err) {
      toast.error('Failed to fetch departments');
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await request({
        url: `${API_URL}/jobs`,
        method: 'GET'
      });
      setJobs(
        response.data.map(j => ({
          JobTitleID: j.JobTitleID,
          Title: j.Title,
          DepartmentID: j.DepartmentID,
          DepartmentName: j.Department?.DepartmentName
        }))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch job titles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (job.JobTitleID) {
        await request({
          url: `${API_URL}/${job.JobTitleID}`,
          method: 'PUT',
          data: job
        });
        toast.success('Job title updated successfully');
      } else {
        await request({
          url: API_URL,
          method: 'POST',
          data: job
        });
        toast.success('Job title added successfully');
      }
      await fetchJobs();
      closeModal();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message ||
        (job.JobTitleID ? 'Failed to update job title' : 'Failed to add job title')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (jobData) => {
    setJob({
      JobTitleID: jobData.JobTitleID,
      Title: jobData.Title,
      DepartmentID: jobData.DepartmentID
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job title?')) {
      setLoading(true);
      try {
        await request({
          url: `${API_URL}/${id}`,
          method: 'DELETE'
        });
        toast.success('Job title deleted successfully');
        await fetchJobs();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to delete job title');
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = () => {
    setJob({ JobTitleID: '', Title: '', DepartmentID: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Job Title Management</h2>
        <button onClick={openModal} className={styles.addButton}>Add Job Title</button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{job.JobTitleID ? 'Edit Job Title' : 'Add Job Title'}</h3>
              <button onClick={closeModal} className={styles.closeButton}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Job Title:</label>
                <input
                  type="text"
                  name="Title"
                  value={job.Title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Department:</label>
                <select
                  name="DepartmentID"
                  value={job.DepartmentID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.DepartmentID} value={dept.DepartmentID}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {job.JobTitleID ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {jobs.length === 0 ? (
          <p className={styles.noData}>No job titles found</p>
        ) : (
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.JobTitleID}>
                  <td>{j.Title}</td>
                  <td>{j.DepartmentName || j.DepartmentID}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(j)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(j.JobTitleID)} className={styles.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddJob;
