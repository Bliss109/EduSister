// src/components/student/MoodTracker.js
import React, { useState } from 'react';
import '../../main.css';

const moods = [
  { icon: '😄', label: 'Happy' },
  { icon: '😔', label: 'Sad' },
  { icon: '😠', label: 'Angry' },
  { icon: '😌', label: 'Calm' },
  { icon: '😰', label: 'Anxious' },
];

const MoodTracker = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="card-section mood-tracker-card">
      <h4>😊 How are you feeling today?</h4>
      <div className="mood-options">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className={`mood-btn ${selected === mood.label ? 'selected' : ''}`}
            onClick={() => setSelected(mood.label)}
          >
            <span className="mood-icon">{mood.icon}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
      {selected && <p className="mood-feedback">You're feeling <strong>{selected}</strong> today 💙</p>}
    </div>
  );
};

export default MoodTracker;
