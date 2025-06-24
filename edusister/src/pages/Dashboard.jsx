// src/pages/Dashboard.jsx
import React from 'react';
import StudentStats from '../components/student/StudentStats';
import JournalResume from '../components/student/JournalResume';
import QuoteAndReflection from '../components/student/QuoteAndReflection';
import MoodTracker from '../components/student/MoodTracker';
import ActivePeerChats from '../components/student/ActivePeerChats';
const Dashboard = () => {
  return (
    <div className="main-section">
      <StudentStats />
      <JournalResume />
      <QuoteAndReflection />
      <div className="mood-peer-wrapper">
        <MoodTracker />
        <ActivePeerChats />
      </div>
    </div>
  );
};

export default Dashboard;