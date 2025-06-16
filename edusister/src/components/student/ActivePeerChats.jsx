// src/components/student/ActivePeerChats.js
import React from 'react';
import '../../main.css';

const ActivePeerChats = () => {
  const chats = [
    { name: "Faith Wanjiru", lastMsg: "You're not alone 🤝", time: "3 mins ago" },
    { name: "Mentor Achieng", lastMsg: "Remember to breathe 💜", time: "Today" },
  ];

  return (
    <div className="card-section peer-chats-card">
      <h4>💬 Active Peer Chats</h4>
      <ul className="chat-list">
        {chats.map((chat, idx) => (
          <li key={idx} className="chat-item">
            <div className="chat-details">
              <p className="chat-name">{chat.name}</p>
              <p className="chat-snippet">{chat.lastMsg}</p>
            </div>
            <span className="chat-time">{chat.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivePeerChats;
