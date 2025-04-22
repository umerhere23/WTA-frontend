import React, { useState, useEffect } from 'react';
import styles from './AddDep.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '../../../../api/request';

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDep, setSelectedDep] = useState(null);
  const [form, setForm] = useState({ DepartmentName: '' });
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await request({ url: '/departments', method: 'GET' });
      setDepartments(res.data);
    } catch (err) {
      toast.error('Failed to load departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openModal = (dep = null) => {
    setSelectedDep(dep);
    setEditMode(!!dep);
    setForm(dep ? { DepartmentName: dep.DepartmentName } : { DepartmentName: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDep(null);
    setForm({ DepartmentName: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, DepartmentName: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await request({
          url: `/departments/${selectedDep._id}`,
          method: 'PUT',
          data: form
        });
        toast.success('Department updated');
      } else {
        await request({
          url: '/departments',
          method: 'POST',
          data: form
        });
        toast.success('Department created');
      }
      fetchDepartments();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await request({
        url: `/departments/${id}`,  // ID from DepartmentID
        method: 'DELETE'
      });
      toast.success('Department deleted');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };
  
  

  return (
    <div className={styles.page}>
      <h2>Departments</h2>
      <button className={styles.addBtn} onClick={() => openModal()}>Add Department</button>
      <table className={styles.table}>
  <thead>
    <tr>
      <th>#</th>
      <th>Department ID</th>
      <th>Department Name</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {departments.map((dep, index) => (
      <tr key={dep.DepartmentID}>
        <td>{index + 1}</td>
        <td>{dep.DepartmentID}</td> {/* Show DepartmentID */}
        <td>{dep.DepartmentName}</td>
        <td>
          <button className={styles.editBtn} onClick={() => openModal(dep)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => deleteDepartment(dep.DepartmentID)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editMode ? 'Edit Department' : 'Add Department'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={form.DepartmentName}
                onChange={handleChange}
                placeholder="Department Name"
                required
              />
              <div className={styles.modalActions}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editMode ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DepartmentPage;
