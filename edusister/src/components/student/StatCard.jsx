// src/components/student/StatCard.js
import React from 'react';
import '../../main.css';

const StatCard = ({ label, count, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h4>{count}</h4>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
