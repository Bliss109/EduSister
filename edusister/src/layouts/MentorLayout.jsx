import React from 'react';
import Sidebar from '../components/mentorComponents/Sidebar';
import Topbar from '../components/mentorComponents/Topbar';
import { Outlet } from 'react-router-dom';
import '../main.scss';

const MentorLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <div className="main-section">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MentorLayout;
