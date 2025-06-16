// src/components/home/journaling/MockPreview.jsx
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import '../../main.css';

const MockPreview = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCTA = () => {
    if (currentUser) {
      navigate('/journals');
    } else {
      navigate('/loginsignup', {
        state: { redirectTo: '/journals' }
      });
    }
  };

  return (
    <section className="mock-preview typewriter-section">
      <div className="mock-preview__text">
        <h2 className="mock-preview__heading">Your Journal, Your Voice 💬</h2>
        <p className="mock-preview__desc">
          Watch your thoughts flow freely — safely and beautifully.
        </p>

        <div className="typewriter-box">
          <span className="typewriter-label">Journal Entry:</span>
          <div className="typewriter-text">
            <Typewriter
              words={[
                'Today felt heavy, but this space feels lighter 💭...',
                'I’m learning to be kinder to myself every day 💕',
                'I wrote 3 pages and I actually feel better now 🌸',
                'One step at a time, I’m healing through my words 🩵'
              ]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={2500}
            />
          </div>
        </div>

        <div className="mock-preview__cta">
          <button className="mock-preview__cta-btn" onClick={handleCTA}>
            Start Journaling Now ✨
          </button>
        </div>
      </div>
    </section>
  );
};

export default MockPreview;
