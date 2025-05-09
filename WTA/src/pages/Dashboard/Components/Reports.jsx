import React, { useState, useEffect } from 'react';
import styles from './Reports.module.css';
import request from '../../../../api/request';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const [engagements, setEngagements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const response = await request({
        url: '/engagements',
        method: 'GET'
      });
      setEngagements(response.data);
    } catch (error) {
      console.error('Error fetching engagements', error);
    } finally {
      setIsLoading(false);
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

  const exportToExcel = () => {
    const data = filteredEngagements.map(engagement => ({
      Department: engagement.Department.DepartmentName,
      Employee: engagement.Employee.FullName,
      'Job Title': engagement.JobTitle.Title,
      Status: engagement.Status,
      'Start Date': engagement.StartDate,
      'End Date': engagement.EndDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Engagements');
    XLSX.writeFile(workbook, 'Engagements_Report.xlsx');
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape' 
      });

      doc.setFontSize(16);
      doc.text('Engagements Report', 14, 15);

      const headers = [
        'Department',
        'Employee', 
        'Job Title',
        'Status',
        'Start Date',
        'End Date'
      ];

      const data = filteredEngagements.map(engagement => [
        engagement.Department.DepartmentName,
        engagement.Employee.FullName,
        engagement.JobTitle.Title,
        engagement.Status,
        engagement.StartDate,
        engagement.EndDate
      ]);

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 25, 
        margin: { horizontal: 10 }, 
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' }
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });

      doc.save('Engagements_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

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

      {isLoading ? (
        <div className={styles.loading}>Loading data...</div>
      ) : (
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
      )}

      <div className={styles.exportButtons}>
        <button 
          className={styles.export} 
          onClick={exportToExcel}
          disabled={isLoading || filteredEngagements.length === 0}
        >
          Export as Excel
        </button>
        <button 
          className={styles.export} 
          onClick={exportToPDF}
          disabled={isLoading || filteredEngagements.length === 0}
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default Reports;