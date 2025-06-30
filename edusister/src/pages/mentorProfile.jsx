// src/pages/MentorProfile.jsx
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Sidebar from "../components/mentorComponents/Sidebar";
import Topbar from "../components/mentorComponents/Topbar";
import "../main.scss";

const MentorProfile = () => {
  const [mentor, setMentor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    expertise: "",
    available: false,
    photoURL: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "mentors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMentor(data);
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            expertise: data.expertise || "",
            available: data.available || false,
            photoURL: data.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch mentor profile:", err);
        setError("Unable to load profile.");
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let photoURL = form.photoURL;

      if (avatarFile) {
        const storageRef = ref(storage, `mentorAvatars/${user.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const updatedData = {
        ...form,
        photoURL,
        email: user.email, // Optional: Save email for display purposes
        uid: user.uid,     // Optional: Save UID for easier filtering elsewhere
      };

      await setDoc(doc(db, "mentors", user.uid), updatedData, { merge: true });
      setSuccess("✅ Profile updated successfully.");
      setMentor(updatedData);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("❌ Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="mentor-profile-container">
          <h2>Edit Your Mentor Profile</h2>
          <div className="card-section">
            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={form.expertise}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group checkbox-inline">
                <label>Available for mentorship?</label>
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group avatar-upload">
                <label>Profile Picture</label>
                {form.photoURL && (
                  <div className="avatar-preview">
                    <img src={form.photoURL} alt="Avatar" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>

              {success && <p className="success-message">{success}</p>}
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
