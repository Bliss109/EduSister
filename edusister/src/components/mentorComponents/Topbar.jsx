import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import "../../main.scss";
import { FaBell } from 'react-icons/fa';
import { name } from 'ejs';

const Topbar = ({mentor}) => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const requestsQuery = query(
      collection(db, 'mentorship_requests'),
      where('status', '==', 'pending'),
      where('mentorId', '==', user.uid),
    );
    const messagesQuery = query(
      collection(db, 'messages'),
      where('receiptentId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsNotifs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        type: 'request',
        name: doc.data().name,
        date: doc.data().date || new Date().toLocaleDateString(),
      }));
      setNotifications(prev => [
        ...prev.filter((n) => n.type !== 'request'), 
        ...requestsNotifs,
      ]);
      setUnreadCount((prev) => prev + requestsNotifs.length);
    });

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesNotifs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        type: 'message',
        text: doc.data().text,
        senderId: doc.data().senderId,
        timestamp: doc.data().timestamp?.toDate().toLocaleTimeString(),
      }));
      setNotifications(prev => [
        ...prev.filter(n => n.type !== 'message'), 
        ...messagesNotifs,
      ]);
      setUnreadCount((prev) => prev + messagesNotifs.length);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeMessages();
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) {
      setUnreadCount(0); // Reset unread count when dropdown is opened
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-right">
        <div className="notification-wrapper" onClick={toggleDropdown}>
          <FaBell className="topbar-icon" />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>

        {dropdownOpen && (
          <div className="notification-dropdown">
            <h3>Notifications</h3>
            {notifications.length > 0 ? (
              <ul className="notification-list">
                {notifications.map((n) => (
                  <li key={n.id} className="notification-item">
                    {n.type === 'request' ? (
                      <span>📩 New mentorship request from <strong>{n.name}</strong> ({n.date})</span>
                    ) : (
                      <span>💬 New message at {n.timestamp}</span>
                    )}
                    </li>
                ))}
                </ul>
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
          </div>
        )} 
        <div className="profile-badge">
          {mentor?.name || "Mentor"}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
