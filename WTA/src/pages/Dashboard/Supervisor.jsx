import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DashboardLayout, Engagements } from './SupDashComponents';  

const SupervisorDashboard = () => {
  const user = useSelector((state) => state.auth.user);

   if (!user || user.role !== 'Supervisor') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/supervisor" element={<DashboardLayout />}>
        <Route path="engagements" element={<Engagements />} />   
      </Route>
    </Routes>
  );
};

export default SupervisorDashboard;
