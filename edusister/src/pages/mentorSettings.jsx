import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import Sidebar from "../components/mentorComponents/Sidebar";
import Topbar from "../components/mentorComponents/Topbar";
import "../main.scss";

const MentorSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = "/"; // redirect to homepage or login
    } catch (err) {
      setFeedback("Failed to sign out. Try again.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="mentor-settings-container">
          <h2>⚙️ Settings</h2>
          <div className="card-section settings-card">
            <div className="form-group checkbox-inline">
              <label>Email Notifications</label>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications((prev) => !prev)}
              />
            </div>

            <div className="form-group checkbox-inline">
              <label>Dark Mode (Coming Soon)</label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                disabled
              />
            </div>

            <div className="form-group">
              <button className="danger-btn" onClick={handleLogout}>
                🚪 Log Out
              </button>
            </div>

            {feedback && <p className="error-message">{feedback}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSettings;
