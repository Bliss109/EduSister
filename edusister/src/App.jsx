// App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup'
import Dashboard from './pages/Dashboard';
import ProtectedRoute from '../ProtectedRoute';

const App = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const hideNavbar = path === '/loginsignup';

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public route */}
        <Route path="/loginsignup" element={<LoginSignup />} />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
