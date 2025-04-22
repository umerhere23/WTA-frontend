import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout, Engagements, Notifications, Reports,AddEmployee, AddJob,AddDep } from './Components';

const HRDashboard = () => {
  return (
    <Routes>
      <Route path="/hr" element={<DashboardLayout />}>
        <Route path="engagements" element={<Engagements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="add-employee" element={<AddEmployee />} />  
        <Route path="add-job" element={<AddJob />} />  
        <Route path="add-department" element={<AddDep />} />  


      </Route>
    </Routes>
  );
};

export default HRDashboard;
