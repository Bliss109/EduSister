// src/components/student/QuoteAndReflection.js
import React, { useState } from 'react';
import '../../main.css';

const QuoteAndReflection = () => {
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (reflection.trim().length === 0) return;
    // 🔁 Hook up Firestore save here later
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="quote-reflection-wrapper">
      {/* 💡 Quote Card */}
      <div className="card-section quote-card">
        <blockquote className="quote-text">
          “Healing doesn’t mean the damage never existed. It means the damage no longer controls your life.”
        </blockquote>
        <p className="quote-author">— Akshay Dubey</p>
      </div>

      {/* 🪞 Reflection Card */}
      <div className="card-section reflection-card">
        <h4 className="reflection-title">🪞 Self-Reflection</h4>
        <p className="reflection-question">What are you most proud of this week?</p>
        <textarea
          placeholder="Write your reflection here..."
          className="reflection-input"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
        <button className="reflection-btn" onClick={handleSave}>
          Save Reflection
        </button>
        {saved && <span className="reflection-saved">✅ Saved!</span>}
      </div>
    </div>
  );
};

export default QuoteAndReflection;
