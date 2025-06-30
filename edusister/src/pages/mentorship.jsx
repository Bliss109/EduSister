import React, { use } from 'react';
import { useNavigate } from 'react-router-dom';
import '../main.scss';
import bannerImg from '../assets/mentorship_banner.jpg';
import HeroTestimonials from '../components/Testimonials/heroTestimonial';
import Navbar from '../components/Navbar/Navbar';
import { auth } from '../firebase';

const PublicMentorshipPage = () => {
  const navigate = useNavigate();

  return (
    <div className="public-mentorship-soft">
        <Navbar />
      {/* Hero Section */}
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1>You're not alone on this journey</h1>
          <p className="hero-subtext">
            Whether you're seeking academic guidance, emotional support, or someone who simply understands — 
            mentorship on EduSister is built for you.
          </p>
          <div className="button-row">
            <button className="primary-btn" onClick={() => {
                if (auth.currentUser){
                    navigate('/connect');
                } else {
                    navigate('/loginsignup');
                }
                }}>Start Mentorship</button>
            <button className="outline-btn" onClick={() => {
                if (auth.currentUser){
                    navigate('/connect');
                } else {
                    navigate('/loginsignup');
                }
                }}>Explore Mentors</button>
          </div>
        </div>
        <div className="hero-img-wrapper">
          <img className="hero-img" src={bannerImg} alt="Mentorship support" />
        </div>
      </div>

      {/* Testimonial Carousel */}
      <HeroTestimonials />

      {/* Final CTA Section */}
      <div className="cta-section text-center">
        <h3>Let your next step be with someone who gets it.</h3>
        <button className="primary-btn" onClick={() => navigate('/loginsignup')}>Join the Sisterhood</button>
      </div>
    </div>
  );
};

export default PublicMentorshipPage;
