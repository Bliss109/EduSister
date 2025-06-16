import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GrUserFemale } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEnvelope, FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../context/authContext';
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle
} from '../firebase/auth';
import { db } from '../firebase/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getFriendlyFirebaseError } from '../utils/firebaseErrors';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const userCred = await doCreateUserWithEmailAndPassword(email, password);
      const user = userCred.user;
      const idToken = await user.getIdToken();

      // call backend to store user profile
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ fullName })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Store extra defaults in client Firestore if needed
      await setDoc(doc(db, "users", user.uid), {
        ...defaultUserProfile,
        uid: user.uid,
        name: fullName,
        email: user.email,
        roles: ['student'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      navigate("/dashboard");
    } catch (err) {
      console.error('Signup error:', err);
      setError(getFriendlyFirebaseError(err.code || err.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCred = await doSignInWithEmailAndPassword(email, password);
      const user = userCred.user;
      const idToken = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err);
      setError(getFriendlyFirebaseError(err.code || err.message));
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const userCred = await doSignInWithGoogle();
      const user = userCred.user;
      const idToken = await user.getIdToken();

      // Check if user doc exists
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          ...defaultUserProfile,
          uid: user.uid,
          name: user.displayName || "Google User",
          email: user.email,
          roles: ['student'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Send to backend for login session creation
      await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken })
      });

      navigate("/dashboard");
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(getFriendlyFirebaseError(err.code || err.message));
    }
  };

  return (
    <div className={`auth-layout ${isSignUp ? 'auth-shift-panel' : ''}`}>
      {/* Sign Up */}
      <div className="auth-panel auth-panel-signup">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>

          <div className="auth-input">
            <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <FaUserAlt />
          </div>

          <div className="auth-input">
            <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <FaEnvelope />
          </div>

          <div className="auth-input">
            <input type={showPassword ? 'text' : 'password'} placeholder="Create Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <RiLockPasswordLine />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>

          <div className="auth-input">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-button-group">
            <button type="submit" className="auth-btn">Sign Up</button>
            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>Sign up with Google</button>
          </div>
        </form>
      </div>

      {/* Log In */}
      <div className="auth-panel auth-panel-login">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>

          <div className="auth-input">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <GrUserFemale />
          </div>

          <div className="auth-input">
            <input type={showLoginPassword ? 'text' : 'password'} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="toggle-password" onClick={() => setShowLoginPassword(!showLoginPassword)}>{showLoginPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-button-group">
            <button type="submit">Log In</button>
            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>Sign in with Google</button>
          </div>

          <Link to="#" className="auth-forgot">Forgot your password?</Link>
        </form>
      </div>

      {/* Overlay Panel */}
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
