import React, { useState, useEffect } from 'react';
import styles from './AddUser.module.css';
import request from '../../../../api/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', role: '', departmentID: '' });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await request({ url: '/users', method: 'POST', data: user });
      toast.success('User added successfully');
      fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding user');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setUser({ name: '', email: '', role: '', departmentID: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <button onClick={openModal} className={styles.addButton}>Add User</button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add New User</h3>
              <button onClick={closeModal} className={styles.closeButton}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
              <input type="text" name="role" placeholder="Role" value={user.role} onChange={handleChange} required />
              <input type="number" name="departmentID" placeholder="Department ID" value={user.departmentID} onChange={handleChange} required />
              <div className={styles.buttons}>
                <button type="submit" disabled={loading}>Save</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department ID</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((u, idx) => (
              <tr key={idx}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.departmentID}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className={styles.noData}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddUser;
