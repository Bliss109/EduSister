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

// const defaultUserProfile = {
//   name: "",
//   email: "",
//   roles: ['student']
// };

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    // if (!loading && currentUser) {
    //   navigate('/dashboard');
    // }
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

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: fullName,
        email: user.email,
        roles: [selectedRole],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // console.log(`✅ Firestore user created: ${user.uid}`);
      // navigate("/dashboard");
      // const role = defaultUserProfile.roles[0];
      if (selectedRole === "mentor") {
        await setDoc(doc(db, "mentors", user.uid), {
          name: fullName,
          email: user.email,
          bio: "",
          expertise: "",
          available: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        navigate("/mentordashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(getFriendlyFirebaseError(err.code || err.message));
    }
  };

  const handleLogin = async (e) => {
    // const userRef = doc(db, "users", currentUser?.uid);
    // const userSnap = await getDoc(userRef);
    e.preventDefault();
    setError('');
    try {
      const userCred = await doSignInWithEmailAndPassword(email, password);
      const user = userCred.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn(`⚠️ No userData found for ${user.uid}`);
      }
      const userData = userSnap.data();
      const role = userData.roles?.[0];

      if(role === "mentor"){
        navigate("/mentordashboard");
      }
      else if (role === "student"){
        navigate("/dashboard");
      }
      else {
        setError("Invalid user role");
      }
    } catch (err) {
      setError(getFriendlyFirebaseError(err.code));
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const userCred = await doSignInWithGoogle();
      const user = userCred.user;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()){
        await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Google User", 
        email: user.email,
        roles: ['student'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      }
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const role = userData.roles?.[0];
      if(role === "mentor"){
        navigate("/mentordashboard");
      }
      else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(getFriendlyFirebaseError(err.code));
    }
  };

  return (
    <div className={`auth-layout ${isSignUp ? 'auth-shift-panel' : ''}`}>
      {/* Sign Up */}
      <div className="auth-panel auth-panel-signup">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>

          <div className="auth-input">
            <input
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <FaUserAlt />
          </div>

          <div className="auth-input">
            <input
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope />
          </div>

          <div className="auth-input">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <RiLockPasswordLine />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="auth-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="auth-input">
            <select
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(e.target.value)
              }
              required
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-button-group">
            <button type="submit" className="auth-btn">Sign Up</button>
            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
              Sign up with Google
            </button>
          </div>
        </form>
      </div>

      {/* Login */}
      <div className="auth-panel auth-panel-login">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>

          <div className="auth-input">
            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <GrUserFemale />
          </div>

          <div className="auth-input">
            <input
              type={showLoginPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-password" onClick={() => setShowLoginPassword(!showLoginPassword)}>
              {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-button-group">
            <button type="submit">Log In</button>
            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </div>

          <Link to="#" className="auth-forgot">Forgot your password?</Link>
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
