// src/components/student/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBookOpen, FaSmile, FaUserFriends, FaComments, FaCogs,
  FaSignOutAlt, FaQuestionCircle
} from 'react-icons/fa';
import { MdSpaceDashboard } from "react-icons/md";
import logo from '../../assets/logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const navigate = useNavigate();

 const handleLogout = async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    toast.success("You are logged out!");
    setTimeout(() => navigate('/'), 100); // ⏱️ add slight delay
  } catch (err) {
    toast.error("Logout failed.");
  }
};


  return (
    <div className='sidebar-container'>
      <div className="navigation">
        <ul>
          <li className="sidebar-logo">
            <img src={logo} alt="EduSister Logo" className="sidebar-logo-img" />
          </li>

          <li>
            <NavLink to="/dashboard" end>
              <span className="sidebar-icon"><MdSpaceDashboard /></span>
              <span className="sidebar-title">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/journals">
              <span className="sidebar-icon"><FaBookOpen /></span>
              <span className="sidebar-title">My Journals</span>
            </NavLink>
          </li>

          <li><NavLink to="/mood-tracker"><span className="sidebar-icon"><FaSmile /></span><span className="sidebar-title">Mood Tracker</span></NavLink></li>
          <li><NavLink to="/mentorship"><span className="sidebar-icon"><FaUserFriends /></span><span className="sidebar-title">Mentorship</span></NavLink></li>
          <li><NavLink to="/chats"><span className="sidebar-icon"><FaComments /></span><span className="sidebar-title">Chats</span></NavLink></li>
          <li><NavLink to="/settings"><span className="sidebar-icon"><FaCogs /></span><span className="sidebar-title">Settings</span></NavLink></li>
          <li><NavLink to="/help"><span className="sidebar-icon"><FaQuestionCircle /></span><span className="sidebar-title">Help</span></NavLink></li>

          <li>
            <NavLink to="#" onClick={handleLogout}>
              <span className="sidebar-icon"><FaSignOutAlt /></span>
              <span className="sidebar-title">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
