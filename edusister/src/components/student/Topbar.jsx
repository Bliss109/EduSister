import React, { useEffect, useState } from 'react';
import { IoMenu } from 'react-icons/io5';
import { FcSearch } from 'react-icons/fc';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import '../../main.css';

const Topbar = ({ setSearchQuery }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchName = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setName(snap.data().name);
      } catch (err) {
        console.error("❌ Failed to fetch user name:", err);
      }
    };

    fetchName();
  }, [currentUser]);

  return (
    <div className="topbar">
      <div className="topbar-toggle">
        <IoMenu />
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Find your entries"
          onChange={handleSearch}
        />
        <FcSearch />
      </div>

      <div className="user-section">
        <span className="username">Hi, {name || 'User'}</span>
        <FaUserCircle className="avatar" />
        <FaBell className="notifications-icon" />
      </div>
    </div>
  );
};

export default Topbar;
