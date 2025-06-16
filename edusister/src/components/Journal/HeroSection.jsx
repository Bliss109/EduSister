// src/components/home/journaling/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import journal from '../../assets/journal.png';
import '../../main.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/journals');
    } else {
      navigate('/loginsignup', {
        state: { redirectTo: '/journals' }
      });
    }
  };

  return (
    <section className="journaling-hero">
      <div className="journaling-hero__content">
        <h1 className="journaling-hero__title">
          Your Safe Space <br />
          <span className="highlight">To Reflect, Grow & Heal</span>
        </h1>
        <p className="journaling-hero__subtitle">
          Express your thoughts, track your mood, and empower your mental health journey. Journaling is private, personal, and designed just for you 💖.
        </p>
        <button className="journaling-hero__cta" onClick={handleGetStarted}>
          Start Journaling
        </button>
      </div>

      <div className="journaling-hero__image">
        <img src={journal} alt="Girl journaling" loading="lazy" />
      </div>
    </section>
  );
};

export default HeroSection;
