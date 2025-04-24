import React, { useState, useEffect } from 'react';
import styles from './Reports.module.css';
import request from '../../../../api/request';

const Reports = () => {
  const [engagements, setEngagements] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    employee: '',
    status: '',
    duration: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEngagements();
  }, []);

  const fetchEngagements = async () => {
    try {
      const response = await request({
        url: '/engagements',
        method: 'GET'
      });
      setEngagements(response.data);
    } catch (error) {
      console.error('Error fetching engagements', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEngagements = engagements.filter(engagement => {
    // Apply dropdown filters first
    if (filters.department && engagement.Department.DepartmentName !== filters.department) {
      return false;
    }
    
    if (filters.employee && !engagement.Employee.FullName.includes(filters.employee)) {
      return false;
    }
    
    if (filters.status && engagement.Status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }
    
    if (filters.duration) {
      const endDate = new Date(engagement.EndDate);
      const today = new Date();
      let cutoffDate;
      
      switch(filters.duration) {
        case '1m':
          cutoffDate = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case '6m':
          cutoffDate = new Date(today.setMonth(today.getMonth() - 6));
          break;
        case '1y':
          cutoffDate = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          return true;
      }
      
      if (endDate < cutoffDate) {
        return false;
      }
    }
    
    // Apply search filter if search term exists
    if (searchTerm) {
      const matchesSearch = 
        engagement.Employee.FullName.toLowerCase().includes(searchTerm) ||
        engagement.Department.DepartmentName.toLowerCase().includes(searchTerm) ||
        engagement.JobTitle.Title.toLowerCase().includes(searchTerm) ||
        engagement.Status.toLowerCase().includes(searchTerm) ||
        engagement.StartDate.includes(searchTerm) ||
        engagement.EndDate.includes(searchTerm);
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className={styles.dashboard}>
      <h3 className={styles.heading}>Reporting Dashboard</h3>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search engagements..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filters}>
        <select name="department" onChange={handleFilterChange} value={filters.department}>
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
        </select>

        <select name="employee" onChange={handleFilterChange} value={filters.employee}>
          <option value="">All Employees</option>
          {[...new Set(engagements.map(e => e.Employee.FullName))].map((name, idx) => (
            <option key={idx} value={name}>{name}</option>
          ))}
        </select>

        <select name="status" onChange={handleFilterChange} value={filters.status}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
        </select>

        <select name="duration" onChange={handleFilterChange} value={filters.duration}>
          <option value="">All Durations</option>
          <option value="1m">Last 1 Month</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 1 Year</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.reportTable}>
          <thead>
            <tr>
              <th>Department</th>
              <th>Employee</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredEngagements.length ? (
              filteredEngagements.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.Department.DepartmentName}</td>
                  <td>{e.Employee.FullName}</td>
                  <td>{e.JobTitle.Title}</td>
                  <td>{e.Status}</td>
                  <td>{e.StartDate}</td>
                  <td>{e.EndDate}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className={styles.noData}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.exportButtons}>
        <button className={styles.export}>Export as Excel</button>
        <button className={styles.export}>Export as PDF</button>
      </div>
    </div>
  );
};

export default Reports;