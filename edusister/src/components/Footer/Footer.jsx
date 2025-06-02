import React from 'react';
import '../../main.css';
import logo from '../../assets/logo.png';

import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-wave"></div> {/* Optional wave layer */}

            <div className="footer-container">

                {/* Logo and Mission */}
                <div className="footer-top">
                    <div className="footer-logo">
                        <a href="/">
                            <img src={logo} alt="EduSister Logo" />
                        </a>
                    </div>
                    <div className="footer-mission">
                        <h4>🌷 Made by sisters, for sisters — always.</h4>
                        <p>EduSister is a gentle space to journal, reflect, and grow — together.</p>
                    </div>
                </div>

                {/* Main Footer Sections */}
                <div className="footer-sections">

                    {/* Navigation */}
                    <div className="footer-block">
                        <h5>Explore</h5>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#mentors">Mentors</a></li>
                            <li><a href="#resources">Resources</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-block">
                        <h5>Tools</h5>
                        <ul>
                            <li><a href="#">Journal Template</a></li>
                            <li><a href="#">Study Planner</a></li>
                            <li><a href="#">Wellness Playlist</a></li>
                            <li><a href="#">Mood Tracker</a></li>
                        </ul>
                    </div>

                    {/* Community / Support */}
                    <div className="footer-block">
                        <h5>Community</h5>
                        <ul>
                            <li><a href="#">Request a Mentor</a></li>
                            <li><a href="#">Safe Conversations</a></li>
                            <li><a href="#">Affirmation Archive</a></li>
                            <li><a href="#">Student Stories</a></li>
                        </ul>
                    </div>

                    {/* Contact and Socials */}
                    <div className="footer-block">
                        <h5>Connect</h5>
                        <div className="footer-socials">
                            <a href="mailto:hello@edusister.com" aria-label="Email">
                                <FaEnvelope />
                            </a>
                            <a href="https://instagram.com/edusister" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://linkedin.com/company/edusister" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>


                </div>

                {/* Inspiration & Inclusivity */}
                <div className="footer-bottom">
                    <em>“You’re doing better than you think.”</em>
                    <small>EduSister celebrates every woman — across faiths, backgrounds, and journeys.</small>
                    <p>© 2025 EduSister. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Use</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
