import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup.jsx';

import HRDashboard from './pages/Dashboard/HRDashboard.jsx';
import SupervisorDashboard from './pages/Dashboard/Supervisor.jsx';  

const App = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hr/*" element={<HRDashboard />} />
          <Route path="/supervisor/*" element={<SupervisorDashboard />} />  
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
