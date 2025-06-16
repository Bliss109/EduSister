// utils/firebaseErrors.js

export const getFriendlyFirebaseError = (code) => {
  const map = {
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/missing-password": "Please enter a password.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/internal-error": "Something went wrong. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  };

  return map[code] || "Authentication failed. Please try again.";
};
