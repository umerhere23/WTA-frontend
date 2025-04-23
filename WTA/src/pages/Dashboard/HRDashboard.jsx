import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout, Engagements, User, Reports,AddEmployee, AddJob,AddDep } from './Components';

const HRDashboard = () => {
  return (
    <Routes>
      <Route path="/hr" element={<DashboardLayout />}>
        <Route path="engagements" element={<Engagements />} />
        <Route path="add-user" element={<User />} />
        <Route path="reports" element={<Reports />} />
        <Route path="add-employee" element={<AddEmployee />} />  
        <Route path="add-job" element={<AddJob />} />  
        <Route path="add-department" element={<AddDep />} />  


      </Route>
    </Routes>
  );
};

export default HRDashboard;
