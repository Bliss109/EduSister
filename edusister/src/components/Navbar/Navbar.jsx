import React, { useState, useEffect } from 'react';
import '../../main.css';
import { Link, useNavigate } from 'react-router-dom';
import { GiGlassHeart } from "react-icons/gi";
import { MdSupportAgent, MdOutlineLanguage } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/authContext';
import { doSignOut } from '../../firebase/auth';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Navbar = () => {
  const { currentUser, loading } = useAuth(); // ✅ include loading
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if(currentUser) {
        try{
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()) {
            setUserRole(docSnap.data().role || null); 
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      setRoleLoading(false); 
    }; 
    fetchUserRole();
  }, [currentUser]);

  if (loading ||  roleLoading) return null; // ⏳ wait for auth state to resolve

  const handleLogout = async () => {
    try {
      await doSignOut();
      toast.success('You have successfully logged out!');
      setTimeout(() => navigate('/'), 100); // ✅ slight delay ensures rerender
    } catch (error) {
      console.error('❌ Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleDashboardClick = () => {
    if(userRole === 'mentor') {
      navigate('/mentordashboard');
    }
    else if(userRole === 'student') {
      navigate('/dashboard');
    }
    else {
      // admin dashboard
    }
  };

  const handleJournalClick = () => {
    if (currentUser) {
      navigate('/journals');
    } else {
      navigate('/loginsignup', { state: { redirectTo: '/journals' } });
    }
  };

  return (
    <div className='navBar flex'>
      {/* 🔹 Top bar */}
      <div className="navBarOne flex">
        <GiGlassHeart className='icon heartIcon' />

        <div className="middleLinks flex">
          <li className="flex"><MdSupportAgent className='icon' />Support</li>
          <li className="flex"><MdOutlineLanguage className='icon' />Language</li>
        </div>

        <div className="atb flex">
          {!currentUser ? (
            <>
              <Link to='/loginsignup'><span>Sign Up</span></Link>
              <Link to='/loginsignup'><span>Log In</span></Link>
            </>
          ) : (
            <>
              <button onClick={handleDashboardClick}><span>Dashboard</span></button>
              <button className='logout-btn' onClick={handleLogout}>Log Out</button>
            </>
          )}
        </div>
      </div>

      {/* 🔹 Main navbar */}
      <div className="navBarTwo">
        <div className="logoDiv">
          <img src={logo} alt="EduSister logo" />
        </div>

        <div className="navBarMenu">
          <ul className="menu flex">
            <li className="listItem"><Link to='/'>Home</Link></li>
            <li className='listItem'><Link to='/journal'>Journal</Link></li>
            <li className="listItem">Resources</li>
            <li className="listItem"><Link to='/mentorship'>Mentorship</Link></li>
            <li className="listItem">SisterCircle</li>
          </ul>

          <button className="btn flex btnOne">Contact</button>

          <div className="toggleIcon">
            <CgMenuGridO />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

