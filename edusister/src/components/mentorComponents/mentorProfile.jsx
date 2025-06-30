// src/components/mentorComponents/MentorProfile.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import "../../main.scss";

const MentorProfile = () => {
  const [mentorData, setMentorData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "mentors", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMentorData(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  if (!mentorData) {
    return (
      <div className="card-section mentor-profile-card">
        <p>Loading mentor profile...</p>
      </div>
    );
  }

  return (
    <div className="card-section mentor-profile-card">
      <h4>👩‍🏫 Mentor Profile</h4>

      <div className="form-group">
        <label>👤 Full Name</label>
        <p>{mentorData.name || "Not provided"}</p>
      </div>

      <div className="form-group">
        <label>📧 Email</label>
        <p>{mentorData.email || "Not provided"}</p>
      </div>

      <div className="form-group">
        <label>📝 Bio</label>
        <p>{mentorData.bio || "Not provided"}</p>
      </div>

      <div className="form-group">
        <label>📚 Expertise</label>
        <p>{mentorData.expertise || "Not provided"}</p>
      </div>

      <div className="form-group checkbox-inline">
        <label>Currently Available</label>
        <p>{mentorData.available ? "Yes" : "No"}</p>
      </div>

      {mentorData.photoURL && (
        <div className="form-group">
          <label>📸 Profile Picture</label>
          <img src={mentorData.photoURL} alt="Mentor" className="profile-photo" />
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
