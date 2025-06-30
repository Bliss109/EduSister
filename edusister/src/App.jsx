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
import StudentMentorship from './pages/studentDashMentorship';
import MentorDashboard from './pages/mentorDashboard';
import Pendingrequests from './pages/PendingRequests';
import ConnectPage from './pages/connectpage';
import PublicMentorshipPage from './pages/Mentorship';
import AcceptedRequests from './pages/acceptedRequests';
import MentorChatAccess from './pages/mentorChat';
import FeedbackSummaryPage from './pages/feedbackSummary';
import MentorProfile from './pages/mentorProfile';
import MentorSettings from './pages/mentorSettings';
import MentorLayout from './layouts/MentorLayout';

const App = () => {
  const location = useLocation();
  const { loading } = useAuth();

  // // Explicitly hide navbar on login/signup and dashboard
  // const hideNavbar = ['/loginsignup', '/dashboard', '/profile', '/dashboard/journals', '/dashboard/moodtracker', '/mentordashboard'].includes(location.pathname);
  const hideNavbar = [
    '/loginsignup',
    '/dashboard',
    '/mentor'
  ].some((prefix) => location.pathname.startsWith(prefix));
  
  if (loading){
    return <div className="loading-screen">Loading EduSister...</div>
  }

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginsignup" element={<LoginSignup />} />
        <Route path="/mentorship" element={<PublicMentorshipPage />} />

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
          <Route path="mentorship" element={<StudentMentorship />} />
          <Route path="connect" element={<ConnectPage />} /> 
        </Route>
        <Route
          path="/mentordashboard"
          element={
            <ProtectedRoute>
              <MentorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MentorDashboard />} />
          <Route path="pendingrequests" element={<Pendingrequests />} />
          <Route path="acceptedrequests" element={<AcceptedRequests />} />
          <Route path="chat" element={<MentorChatAccess />} />
          <Route path="feedback" element={<FeedbackSummaryPage />} />
          <Route path="profile" element={<MentorProfile />} />
          <Route path="settings" element={<MentorSettings />} />

        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
