// src/components/home/journaling/StepsToJournal.jsx
import React from 'react';
import { FaSmileBeam, FaPenFancy, FaChartLine } from 'react-icons/fa';
import '../../main.css';

const steps = [
  {
    icon: <FaSmileBeam />,
    title: "Pick Your Mood",
    desc: "Select how you're feeling to start reflecting.",
    bg: "#fce7f3",
  },
  {
    icon: <FaPenFancy />,
    title: "Write Freely",
    desc: "Journal your thoughts in a safe, private space.",
    bg: "#ede9fe",
  },
  {
    icon: <FaChartLine />,
    title: "Track & Reflect",
    desc: "Look back at your progress and insights.",
    bg: "#e0f2fe",
  },
];

const StepsToJournal = () => {
  return (
    <section className="steps-section">
      <h2 className="steps-heading">How Journaling Works</h2>

      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-card" style={{ backgroundColor: step.bg }}>
            <div className="step-icon">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsToJournal;
