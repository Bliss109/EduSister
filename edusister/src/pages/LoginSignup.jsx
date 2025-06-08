import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrUserFemale } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEnvelope, FaUserAlt } from "react-icons/fa";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={`auth-layout ${isSignUp ? 'auth-shift-panel' : ''}`}>
      {/* Sign Up Form */}
      <div className="auth-panel auth-panel-signup">
        <form>
          <h1>Create Account</h1>

          <div className="auth-input">
            <input type="text" placeholder="Full Name" required />
            <FaUserAlt />
          </div>

          <div className="auth-input">
            <input type="email" placeholder="Email Address" required />
            <FaEnvelope />
          </div>

          <div className="auth-input">
            <input type="password" placeholder="Create Password" required />
            <RiLockPasswordLine />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Login Form */}
      <div className="auth-panel auth-panel-login">
        <form>
          <h1>Sign In</h1>

          <div className="auth-input">
            <input type="text" placeholder="Username" required />
            <GrUserFemale />
          </div>

          <div className="auth-input">
            <input type="password" placeholder="Password" required />
            <RiLockPasswordLine />
          </div>

          <Link to="#" className="auth-forgot">Forgot your password?</Link>

          <button type="submit">Log In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className="auth-overlay-container">
        <div className="auth-overlay">
          <div className="auth-overlay-panel auth-overlay-left">
            <h1>Welcome Back!</h1>
            <p>If you already have an account, login here</p>
            <button className="auth-btn-secondary" onClick={() => setIsSignUp(false)}>Log In</button>
          </div>
          <div className="auth-overlay-panel auth-overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details to sign up</p>
            <button className="auth-btn-secondary" onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
