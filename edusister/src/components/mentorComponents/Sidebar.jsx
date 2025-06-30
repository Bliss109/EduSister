import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCheck, FaUserFriends, FaComments, FaClipboardCheck,
  FaUserCircle, FaCogs, FaSignOutAlt
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
      toast.success("Logged out successfully");
      setTimeout(() => navigate('/'), 100);
    } catch (err) {
      toast.error("Logout failed");
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
            <Link to="/mentordashboard" end>
              <span className="sidebar-icon"><MdSpaceDashboard /></span>
              <span className="sidebar-title">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link to="/mentordashboard/pendingrequests">
              <span className="sidebar-icon"><FaUserCheck /></span>
              <span className="sidebar-title">Pending Requests</span>
            </Link>
          </li>

          <li>
            <Link to="/mentordashboard/acceptedrequests">
              <span className="sidebar-icon"><FaUserFriends /></span>
              <span className="sidebar-title">Accepted Mentees</span>
            </Link>
          </li>

          <li>
            <Link to="/mentordashboard/chat">
              <span className="sidebar-icon"><FaComments /></span>
              <span className="sidebar-title">Chat Access</span>
            </Link>
          </li>

          <li>
            <Link to="/mentordashboard/feedback">
              <span className="sidebar-icon"><FaClipboardCheck /></span>
              <span className="sidebar-title">Feedback Summary</span>
            </Link>
          </li>

          <li>
            <Link to="/mentordashboard/profile">
              <span className="sidebar-icon"><FaUserCircle /></span>
              <span className="sidebar-title">Mentor Profile</span>
            </Link>
          </li>

          <li>
            <Link to="/mentordashboard/settings">
              <span className="sidebar-icon"><FaCogs /></span>
              <span className="sidebar-title">Settings</span>
            </Link>
          </li>

          <li>
            <Link to="#" onClick={handleLogout}>
              <span className="sidebar-icon"><FaSignOutAlt /></span>
              <span className="sidebar-title">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
