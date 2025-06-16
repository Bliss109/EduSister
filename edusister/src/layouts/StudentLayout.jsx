import React, { useState } from 'react';
import Sidebar from '../components/student/Sidebar';
import Topbar from '../components/student/Topbar';
import { Outlet } from 'react-router-dom';

const StudentLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar setSearchQuery={setSearchQuery} />
        <Outlet context={{ searchQuery }} />
      </div>
    </div>
  );
};

export default StudentLayout;