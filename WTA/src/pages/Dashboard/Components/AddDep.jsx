import React, { useState, useEffect } from 'react';
import styles from './AddDep.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '../../../../api/request';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDep, setSelectedDep] = useState(null);
  const [form, setForm] = useState({ DepartmentName: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    setEditMode(Boolean(dep));
    setForm(dep ? { DepartmentName: dep.DepartmentName } : { DepartmentName: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDep(null);
    setForm({ DepartmentName: '' });
    setEditMode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, DepartmentName: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.DepartmentName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      if (editMode && selectedDep) {
        await request({
          url: `/departments/${selectedDep.DepartmentID}`,
          method: 'PUT',
          data: form
        });
        toast.success('Department updated successfully');
      } else {
        await request({
          url: '/departments',
          method: 'POST',
          data: form
        });
        toast.success('Department created successfully');
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
        url: `/departments/${id}`,
        method: 'DELETE'
      });
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(dep =>
    dep.DepartmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.DepartmentID?.toString().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Department Management</h2>
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button className={styles.addButton} onClick={() => openModal()}>
            <FiPlus className={styles.buttonIcon} />
            Add Department
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.departmentTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dep, index) => (
                <tr key={dep.DepartmentID}>
                  <td data-label="#">{index + 1}</td>
                  <td data-label="Department ID">{dep.DepartmentID}</td>
                  <td data-label="Department Name">{dep.DepartmentName}</td>
                  <td data-label="Actions">
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openModal(dep)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteDepartment(dep.DepartmentID)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noData}>
                  {searchTerm ? 'No matching departments found' : 'No departments available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editMode ? 'Edit Department' : 'Add New Department'}</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Department Name</label>
                <input
                  type="text"
                  value={form.DepartmentName}
                  onChange={handleChange}
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editMode ? 'Update Department' : 'Create Department'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default DepartmentPage;
