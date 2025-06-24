import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from '../ProtectedRoute'
import StudentLayout from './layouts/StudentLayout';
import Journal from './pages/Journal';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/authContext';
import 'react-toastify/dist/ReactToastify.css';
import MoodTracker from './pages/moodTracker';
import MentorDashboard from './pages/mentorDashboard';


const App = () => {
  const location = useLocation();
  const { loading } = useAuth();

  // ✅ Explicitly hide navbar on login/signup and dashboard
  const hideNavbar = ['/loginsignup', '/dashboard', '/profile', '/dashboard/journals', '/dashboard/moodtracker'].includes(location.pathname);

  if (loading){
    return <div className="loading-screen">Loading EduSister...</div>
  }

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginsignup" element={<LoginSignup />} />
        
        {/* Dashboard w/ Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="journals" element={<Journal />} />
          <Route path="moodtracker" element={<MoodTracker/>} />
          <Route path="mentordashboard" element={<MentorDashboard/>} />

        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
