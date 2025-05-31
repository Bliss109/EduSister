import React from 'react';
import '../../main.css';
import { FaHandsHelping, FaHeart, FaUsers, FaSpa } from 'react-icons/fa';

const Header = () => {
    return (
        <div className='header'>
            <div className="header-row">
                <div className="header-col header-text">
                    <h1 className="animated-heading">
                        {"Your Space. Your Pace.".split("").map((char, index) => (
                            <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>{char}</span>
                        ))}
                    </h1>

                    <p>A gentle space for faith, friendship & self-care.<br />
                        Feel seen, heard, and held in sisterhood.<br />
                        💖 Join EduSister — your journey starts here.
                    </p>
                    <button className='cta-btn'>Join EduSister</button>
                </div>

                <div className="header-col header-cards">
                    <div className="cardsGrid">
                        <div className="card">
                            <div className="category__icon"><FaHandsHelping /></div>
                            <h5>Mentorship</h5>
                            <p>Connect with experienced sisters ready to guide your academic and personal growth.</p>
                        </div>
                        <div className="card">
                            <div className="category__icon"><FaHeart /></div>
                            <h5>Emotional Care</h5>
                            <p>A safe space to share your feelings, reflect, and find encouragement every day.</p>
                        </div>
                        <div className="card">
                            <div className="category__icon"><FaUsers /></div>
                            <h5>Sisterhood</h5>
                            <p>Build lasting friendships with peers who understand and uplift each other.</p>
                        </div>                                                                     <div className="card">
                            <div className="category__icon"><FaSpa /></div>                            <h5>Self-Care</h5>
                            <p>Access tools to track moods, journal thoughts, and nurture your well-being.</p>
                        </div>                                                                 </div>
                </div>                                                                 </div>
        </div>
    );
};

export default Header;