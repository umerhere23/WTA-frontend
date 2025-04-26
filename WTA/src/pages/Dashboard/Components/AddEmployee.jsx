import React, { useState, useEffect } from 'react';
import styles from './AddEmployee.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '../../../../api/request';

const API_URL = '/employees';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    EmployeeID: '',
    FullName: '',
    ContactInfo: ''
  });
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const generateRandomID = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit random ID
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await request({
        url: API_URL,
        method: 'GET'
      });
      setEmployees(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setEmployee({
      EmployeeID: generateRandomID(),
      FullName: '',
      ContactInfo: ''
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEmployee({
      EmployeeID: '',
      FullName: '',
      ContactInfo: ''
    });
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await request({
          url: `${API_URL}/${employee.EmployeeID}`,
          method: 'PUT',
          data: employee
        });
        toast.success('Employee updated successfully');
      } else {
        await request({
          url: API_URL,
          method: 'POST',
          data: employee
        });
        toast.success('Employee added successfully');
      }

      await fetchEmployees();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 
        (isEditMode ? 'Failed to update employee' : 'Failed to add employee'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEmployee(emp);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeID) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      try {
        await request({
          url: `${API_URL}/${employeeID}`,
          method: 'DELETE'
        });
        toast.success('Employee deleted successfully');
        await fetchEmployees();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to delete employee');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Employee Management</h2>
        <button onClick={openModal} className={styles.addButton}>
          Add Employee
        </button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{isEditMode ? 'Edit Employee' : 'Add Employee'}</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Employee ID:</label>
                <input
                  type="text"
                  name="EmployeeID"
                  value={employee.EmployeeID}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label>Full Name:</label>
                <input
                  type="text"
                  name="FullName"
                  value={employee.FullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contact Info:</label>
                <input
                  type="text"
                  name="ContactInfo"
                  value={employee.ContactInfo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {isEditMode ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className={styles.tableContainer}>
        {employees.length === 0 ? (
          <p className={styles.noData}>No employees found</p>
        ) : (
          <table className={styles.employeeTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Contact Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.EmployeeID}>
                  <td>{emp.EmployeeID}</td>
                  <td>{emp.FullName}</td>
                  <td>{emp.ContactInfo}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => handleEdit(emp)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.EmployeeID)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
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

export default AddEmployee;
