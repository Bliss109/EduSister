import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrUserFemale } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEnvelope, FaUserAlt } from "react-icons/fa";
import {auth, db} from '../firebase';
import { signOut } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const LoginSignup = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginFormData, setLoginFormData] = useState({email: '', password: ''});
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  const [signupFormData, setSignupFormData] = useState({fullName: '', email: '', password: '', confirmPassword: ''});
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  
  const usersRef = collection(db, 'users');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        // Optionally, fetch user info or set up app-specific session here
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally, call backend to revoke refresh tokens
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLoginChange = (e) => {
    const {name, value} = e.target;
    setLoginFormData({...loginFormData, [name]: value});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted:');
    console.log('Atempting to login with email:', loginFormData.email);
    setLoginError('');
    setLoginSuccess('');

    try{
    const userCredential = await signInWithEmailAndPassword(
      auth, loginFormData.email, loginFormData.password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ idToken }),
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    // await addDoc(usersRef, {
    //   email: user.email,
    //   uid: user.uid,
    //   loginTime: new Date(), });
    
    console.log('User logged in:', user);
    setLoginSuccess('Login successful!');
    // future ref: add navigation
    }
    catch (error) {
      console.error('Login error:', error);
      if(error.code){
        switch (error.code) {
          case 'auth/user-not-found':
            setLoginError('No user found with this email.');
            break;
          case 'auth/wrong-password':
            setLoginError('Incorrect password. Please try again.');
            break;
          case 'auth/invalid-email':
            setLoginError('Invalid email format. Please enter a valid email.');
            break;
          case 'auth/network-request-failed':
            setLoginError('Network error. Please check your internet connection.');
            break;
          case 'auth/too-many-requests':
            setLoginError('Too many login attempts. Please try again later.');
            break;
          case 'FirebaseError':
            setLoginError('Database permissiondenied.');
            break;
          default:
            setLoginError(`Login failed: ${error.message}`);
            break;
        }
      }
      else{
        setLoginError(`Login failed: ${error.message}`);
      }
    }
  };

  const handleSignupChange = (e) => {
    const {name, value} = e.target;
    setSignupFormData({...signupFormData, [name]: value});
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup form submitted:');
    console.log('Attempting to sign up with email:', signupFormData.email);
    setSignupError('');
    setSignupSuccess(''); 

    if (signupFormData.password !== signupFormData.confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, signupFormData.email, signupFormData.password);
      const user = userCredential.user;

      await addDoc(usersRef, {
        fullName: signupFormData.fullName,
        email: user.email,
        uid: user.uid,
        signupTime: new Date(),
      });
   
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupFormData.email,
          password: signupFormData.password,
          fullName: signupFormData.fullName,
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      console.log('User signed up:', user);
      console.log('Signup backend response:', data);
      setSignupSuccess('Signup successful! You can now log in.');
      setSignupFormData({fullName: '', email: '', password: '', confirmPassword: ''});
      setIsSignUp(false); 
    } 
    catch (error) {
      console.error('Signup error:', error);
      if(error.code){
        switch (error.code) {
          case 'auth/email-already-in-use':
            setSignupError('This email is already registered.');
            break;
          case 'auth/invalid-email':
            setSignupError('Invalid email format. Please enter a valid email.');
            break;
          case 'auth/weak-password':
            setSignupError('Password should be at least 6 characters long.');
            break;
          case 'auth/network-request-failed':
            setSignupError('Network error. Please check your internet connection.');
            break;
          case 'DatabaseError':
            setSignupError('Database permission denied.');
            break;
          default:
            setSignupError(`Signup failed: ${error.message}`);
            break;
        }
      }
      else{
        setSignupError(`Signup failed: ${error.message}`);
      }
    }
  };

  return (
    <div className={`auth-layout ${isSignUp ? 'auth-shift-panel' : ''}`}>
      {currentUser ? (
        <div className="auth-panel auth-panel-login" style={{ zIndex: 2, position: 'relative' }}> 
        <div style={{ textAlign: 'center', padding: '200px'}}>
          <h1>Welcome!</h1>
          <p className="user-display-text" style={{ fontSize: '1.2em', marginBottom: '20px'}}>
            {currentUser.displayName ? `Welcome, ${currentUser.displayName}!` : `Welcome, ${currentUser.email}!`}
          </p>
          <button className="auth-btn-secondary" onClick={handleLogout} style={{ width: 'auto', padding: '10px 30px' }}>
            Log Out
          </button>
        </div>
      </div>
      ) : (
        <>
          {/* Sign Up Form */}
      <div className="auth-panel auth-panel-signup">
        <form onSubmit={handleSignupSubmit}>
          <h1>Create Account</h1>

          <div className="auth-input">
            <input type="text" placeholder="Full Name" name="fullName" value={signupFormData.fullName} onChange={handleSignupChange} required />
            <FaUserAlt />
          </div>

          <div className="auth-input">
            <input type="email" placeholder="Email Address" name="email" value={signupFormData.email} onChange={handleSignupChange} required />
            <FaEnvelope />
          </div>

          <div className="auth-input">
            <input type="password" placeholder="Create Password" name="password" value={signupFormData.password} onChange={handleSignupChange}required />
            <RiLockPasswordLine />
          </div>

          <div className="auth-input">
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={signupFormData.confirmPassword} onChange={handleSignupChange}required />
            <RiLockPasswordLine />
          </div>

          <button type="submit">Sign Up</button>
          {signupError && <p className="auth-error">{signupError}</p>}
          {signupSuccess && <p className="auth-success">{signupSuccess}</p>}
        </form>
      </div>

          {/* Login Form */}
      <div className="auth-panel auth-panel-login">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>

          <div className="auth-input">
            <input type="email" placeholder="Email Address" name="email" value={loginFormData.email} onChange={handleLoginChange} required />
            <GrUserFemale />
          </div>

          <div className="auth-input">
            <input type="password" placeholder="Password" name="password" value={loginFormData.password} onChange={handleLoginChange} required />
            <RiLockPasswordLine />
          </div>

          <Link to="#" className="auth-forgot">Forgot your password?</Link>

          <button type="submit">Log In</button>
          {loginError && <p className="auth-error">{loginError}</p>}
          {loginSuccess && <p className="auth-success">{loginSuccess}</p>}
        </form>
      </div>
        </> 
      )}

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
