import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiBriefcase, FiCalendar, FiMail, FiCheck, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';
import request from '../../../../api/request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Engagements.module.css';

const Engagements = () => {
  const [engagements, setEngagements] = useState([]);
  const [filteredEngagements, setFilteredEngagements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    jobTitle: '',
    status: '',
  });

  const [dropdownData, setDropdownData] = useState({
    jobTitles: [],
    supervisors: [],
    departments: [],
    employees: [],
  });

  useEffect(() => {
    toast.info("Toast test - should show");
  }, []);

  useEffect(() => {
    console.log("Toast test");
    toast("Toast test working?");
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        engagementsRes, 
        jobTitlesRes, 
        supervisorsRes, 
        departmentsRes, 
        employeesRes
      ] = await Promise.all([
        request({ method: 'get', url: '/engagements' }),
        request({ method: 'get', url: '/jobTitles/jobs' }),
        request({ method: 'get', url: '/supervisors' }),
        request({ method: 'get', url: '/departments' }),
        request({ method: 'get', url: '/employees' })
      ]);

      setEngagements(engagementsRes.data);
      setFilteredEngagements(engagementsRes.data);
      setDropdownData({
        jobTitles: jobTitlesRes.data,
        supervisors: supervisorsRes.data,
        departments: departmentsRes.data,
        employees: employeesRes.data,
      });
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, engagements]);

  const applyFilters = () => {
    let result = engagements;

     if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(engagement => {
        const employeeName = dropdownData.employees.find(
          e => e.EmployeeID === engagement.EmployeeID
        )?.FullName?.toLowerCase() || '';
        
        const departmentName = dropdownData.departments.find(
          d => d.DepartmentID === engagement.DepartmentID
        )?.DepartmentName?.toLowerCase() || '';
        
        const jobTitle = dropdownData.jobTitles.find(
          j => j.JobTitleID === engagement.JobTitleID
        )?.Title?.toLowerCase() || '';

        return (
          employeeName.includes(term) ||
          departmentName.includes(term) ||
          jobTitle.includes(term) ||
          engagement.Status.toLowerCase().includes(term)
        );
      });
    }

     if (filters.department) {
      result = result.filter(
        engagement => engagement.DepartmentID === parseInt(filters.department)
      );
    }

    if (filters.jobTitle) {
      result = result.filter(
        engagement => engagement.JobTitleID === parseInt(filters.jobTitle)
      );
    }

    if (filters.status) {
      result = result.filter(
        engagement => engagement.Status === filters.status
      );
    }

    setFilteredEngagements(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      department: '',
      jobTitle: '',
      status: '',
    });
  };

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (engagement) => {
    setEditData(engagement);
    setShowModal(true);
  };

  const handleDelete = async (engagementId) => {
    try {
      await request({ 
        method: 'delete', 
        url: `/engagements/${engagementId}`
      });
      toast.success('Engagement deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete engagement');
    }
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        ...formData,
        EmployeeID: formData.EmployeeID,
        DepartmentID: formData.DepartmentID,
        JobTitleID: formData.JobTitleID,
        SupervisorID: formData.SupervisorID,
        DeptManagerEmail: formData.DeptManagerEmail,
        EndDate: formData.EndDate,
        HRContactEmail: formData.HRContactEmail,
        StartDate: formData.StartDate,
        Status: formData.Status
      };

      if (formData.EngagementID) {
         await request({ 
          method: 'put', 
          url: `/engagements/${formData.EngagementID}`, 
          data: payload 
        });
        toast.success('Engagement updated successfully!');
      } else {
         await request({ 
          method: 'post', 
          url: '/engagements', 
          data: payload 
        });
        toast.success('Engagement created successfully!');
      }

      fetchData();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save engagement');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading data...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Engagements</h2>
        <button className={styles.addButton} onClick={handleAdd}>
          + Add Engagement
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search engagements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Departments</option>
            {dropdownData.departments.map(dept => (
              <option key={dept.DepartmentID} value={dept.DepartmentID}>
                {dept.DepartmentName}
              </option>
            ))}
          </select>

          <select
            name="jobTitle"
            value={filters.jobTitle}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Job Titles</option>
            {dropdownData.jobTitles.map(job => (
              <option key={job.JobTitleID} value={job.JobTitleID}>
                {job.Title}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>

          <button 
            onClick={resetFilters} 
            className={styles.resetButton}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {filteredEngagements.length === 0 ? (
        <div className={styles.noData}>No engagements found</div>
      ) : (
        <div className={styles.tableContainer}>
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
              {filteredEngagements.map((engagement) => (
                <tr key={engagement.EngagementID}>
                  <td>
                    {dropdownData.employees.find(
                      e => e.EmployeeID === engagement.EmployeeID
                    )?.FullName || 'N/A'}
                  </td>
                  <td>
                    {dropdownData.departments.find(
                      d => d.DepartmentID === engagement.DepartmentID
                    )?.DepartmentName || 'N/A'}
                  </td>
                  <td>
                    {dropdownData.jobTitles.find(
                      j => j.JobTitleID === engagement.JobTitleID
                    )?.Title || 'N/A'}
                  </td>
                  <td>{new Date(engagement.StartDate).toLocaleDateString()}</td>
                  <td>
                    {engagement.EndDate 
                      ? new Date(engagement.EndDate).toLocaleDateString() 
                      : '—'}
                  </td>
                  <td>{engagement.Status}</td>
                  <td>
                    {dropdownData.supervisors.find(
                      s => s.SupervisorID === engagement.SupervisorID
                    )?.FullName || 'N/A'}
                  </td>
                  <td className={styles.actionCell}>
                    <button 
                      className={styles.editBtn} 
                      onClick={() => handleEdit(engagement)}
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => handleDelete(engagement.EngagementID)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <EngagementModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          data={editData}
          dropdownData={dropdownData}
          isEditMode={!!editData}
        />
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



const EngagementModal = ({ onClose, onSave, data, dropdownData, isEditMode }) => {
  const [form, setForm] = React.useState({
    EngagementID: data?.EngagementID || '',
    EmployeeID: data?.EmployeeID || '',
    DepartmentID: data?.DepartmentID || '',
    JobTitleID: data?.JobTitleID || '',
    SupervisorID: data?.SupervisorID || '',
    StartDate: data?.StartDate || '',
    EndDate: data?.EndDate || '',
    DeptManagerEmail: data?.DeptManagerEmail || '',
    HRContactEmail: data?.HRContactEmail || '',
    Status: data?.Status || 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{isEditMode ? 'Edit Engagement' : 'New Engagement'}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>
                <FiUser className={styles.inputIcon} />
                Employee
              </label>
              <select
                name="EmployeeID"
                value={form.EmployeeID}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {(dropdownData?.employees || []).map(emp => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiBriefcase className={styles.inputIcon} />
                Department
              </label>
              <select
                name="DepartmentID"
                value={form.DepartmentID}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {(dropdownData?.departments || []).map(dept => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiBriefcase className={styles.inputIcon} />
                Job Title
              </label>
              <select
                name="JobTitleID"
                value={form.JobTitleID}
                onChange={handleChange}
                required
              >
                <option value="">Select Job Title</option>
                {(dropdownData?.jobTitles || []).map(job => (
                  <option key={job.JobTitleID} value={job.JobTitleID}>
                    {job.Title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiUser className={styles.inputIcon} />
                Supervisor
              </label>
              <select
                name="SupervisorID"
                value={form.SupervisorID}
                onChange={handleChange}
                required
              >
                <option value="">Select Supervisor</option>
                {(dropdownData?.supervisors || []).map(sup => (
                  <option key={sup.SupervisorID} value={sup.SupervisorID}>
                    {sup.FullName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiCalendar className={styles.inputIcon} />
                Start Date
              </label>
              <input
                type="date"
                name="StartDate"
                value={form.StartDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiCalendar className={styles.inputIcon} />
                End Date
              </label>
              <input
                type="date"
                name="EndDate"
                value={form.EndDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiMail className={styles.inputIcon} />
                Dept. Manager Email
              </label>
              <input
                type="email"
                name="DeptManagerEmail"
                value={form.DeptManagerEmail}
                onChange={handleChange}
                placeholder="manager@company.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiMail className={styles.inputIcon} />
                HR Contact Email
              </label>
              <input
                type="email"
                name="HRContactEmail"
                value={form.HRContactEmail}
                onChange={handleChange}
                placeholder="hr@company.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiCheck className={styles.inputIcon} />
                Status
              </label>
              <select
                name="Status"
                value={form.Status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Ended">Ended</option>
               </select>
            </div>
          </div>

          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              {isEditMode ? 'Update Engagement' : 'Create Engagement'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
  position="top-right"
  style={{ zIndex: 9999 }}
/>
      
    </div>
  );
};

export default Engagements;
