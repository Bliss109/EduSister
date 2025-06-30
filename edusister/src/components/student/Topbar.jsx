import React, { useEffect, useState } from 'react';
import { IoMenu } from 'react-icons/io5';
import { FcSearch } from 'react-icons/fc';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import { collection, query, where, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import '../../main.css';
import { update } from 'firebase/database';

const Topbar = ({ setSearchQuery }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchUserName = async () => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid);
    const snap = await getDocs(docRef);
    if (snap.exists()) setName(snap.data().name);
  };

  const fetchNotifications = async () => {
    if(!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("menteeId", "==", currentUser.uid),
      where("status", "==", "unread")
    );
    const snapshot = await getDocs(q);
    const notifs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setNotifications(notifs);
  };

  const markAsRead = async (notifId) =>{
    try{
      await updateDoc(doc(db, "notifications", notifId),
    {
      status: "read"
    });
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch(error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchNotifications();
  }, [currentUser]);
  
  // const toggleDropdown = async () => {
  //   setDropdownOpen(prev => !prev);
  //   if (!dropdownOpen) {
  //     notifications.filter(n => !n.read).forEach(n => {
  //       const ref = doc(db, 'notifications', n.id);
  //       updateDoc(ref, { read: true });
  //     });
  //     setUnreadCount(0);
  //   }
  // };
  //   try {
  //       const docRef = doc(db, 'users', currentUser.uid);
  //       const snap = await getDoc(docRef);
  //       if (snap.exists()) setName(snap.data().name);
  //     } catch (err) {
  //       console.error("❌ Failed to fetch user name:", err);
  //     }
  //   };

  //   fetchName();
  // }, [currentUser]);

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
        <div className='notifications-wrapper'>
          <div className="bell-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaBell className="notifications-icon" />
          {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
        </div>
        {dropdownOpen && (
            <div className="notif-dropdown">
              {notifications.length === 0 ? (
                <p className='no-notifs'>no new notifications</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className='notif-item' onClick={() => markAsRead(notif.id)}>
                    {notif.message}
                  </div>
                ))
              )}
              </div>
              )}
        </div> 
      </div>
    </div>
  );
};

export default Topbar;
