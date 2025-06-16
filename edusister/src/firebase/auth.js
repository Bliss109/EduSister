// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  updatePassword,
  signOut,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return signOut(auth);
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
