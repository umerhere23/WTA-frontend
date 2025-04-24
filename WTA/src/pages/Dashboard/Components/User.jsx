import React, { useState, useEffect } from 'react';
import styles from './AddUser.module.css';
import request from '../../../../api/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiLoader } from 'react-icons/fi';

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [user, setUser] = useState({ 
    FullName: '', 
    Email: '', 
    Role: '', 
    Password: '',
    DepartmentID: null 
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const roles = ['HR', 'Supervisor', 'Manager'];

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await request({ url: '/users', method: 'GET' });
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await request({ url: '/departments', method: 'GET' });
      setDepartments(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching departments');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userData = { ...user };
      
      if (userData.Role !== 'HR') {
        if (!userData.DepartmentID) {
          throw new Error('Department is required for Supervisor/Manager');
        }
      } else {
        delete userData.DepartmentID;
      }

      if (editingUserId) {
        await request({ url: `/users/${editingUserId}`, method: 'PUT', data: userData });
        toast.success('User updated successfully');
      } else {
        await request({ url: '/users', method: 'POST', data: userData });
        toast.success('User added successfully');
      }
  
      fetchUsers();
      closeModal();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred while saving the user.';
        
      toast.error(errorMsg);
      console.error('User save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setUser({
      FullName: u.FullName,
      Email: u.Email,
      Role: u.Role,
      Password: '',
      DepartmentID: u.DepartmentID || null
    });
    setEditingUserId(u.UserID);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      await request({ url: `/users/${id}`, method: 'DELETE' });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setUser({ FullName: '', Email: '', Role: '', Password: '', DepartmentID: null });
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
  };

  const filteredUsers = users.filter(user => 
    user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>User Management</h2>
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={openModal} className={styles.addButton}>
            <FiPlus className={styles.buttonIcon} />
            Add User
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <FiLoader className={styles.spinner} />
          Loading...
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingUserId ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="FullName"
                  placeholder="Enter full name"
                  value={user.FullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  placeholder="Enter email"
                  value={user.Email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Role</label>
                <select 
                  name="Role" 
                  value={user.Role} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              {(user.Role === 'Supervisor' || user.Role === 'Manager') && (
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <select
                    name="DepartmentID"
                    value={user.DepartmentID || ''}
                    onChange={handleChange}
                    required={user.Role === 'Supervisor' || user.Role === 'Manager'}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.DepartmentID} value={dept.DepartmentID}>
                        {dept.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {!editingUserId && (
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="Password"
                    placeholder="Enter password"
                    value={user.Password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className={styles.formButtons}>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className={styles.submitButton}
                >
                  {loading ? (
                    <FiLoader className={styles.spinner} />
                  ) : editingUserId ? (
                    'Update User'
                  ) : (
                    'Add User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((u, idx) => (
              <tr key={idx}>
                <td data-label="ID">{u.UserID}</td>
                <td data-label="Full Name">{u.FullName}</td>
                <td data-label="Email">{u.Email}</td>
                <td data-label="Role">
                  <span className={`${styles.roleBadge} ${styles[`role-${u.Role.toLowerCase()}`]}`}>
                    {u.Role}
                  </span>
                </td>
                <td data-label="Department">
                  {u.Department ? u.Department.DepartmentName : 'N/A'}
                </td>
                <td data-label="Created At">{new Date(u.createdAt).toLocaleString()}</td>
                <td data-label="Actions">
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editBtn} 
                      onClick={() => handleEdit(u)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => handleDelete(u.UserID)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  {searchTerm ? 'No matching users found' : 'No users available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default AddUser;
