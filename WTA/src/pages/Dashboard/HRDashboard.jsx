import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout, Engagements, Notifications, Reports } from './Components';

const HRDashboard = () => {
  return (
    <Routes>
      <Route path="/hr" element={<DashboardLayout />}>
        <Route path="engagements" element={<Engagements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default HRDashboard;
