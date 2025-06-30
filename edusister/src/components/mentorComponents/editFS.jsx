import React, { useState, useEffect } from "react";
import "../../main.scss";

const EditableFeedbackSummary = ({ mentorData, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    expertise: "",
    available: false,
  });

  useEffect(() => {
    if (mentorData) {
      setForm(mentorData);
    }
  }, [mentorData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await onSave(form);
      alert("Profile updated!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save. Try again.");
    }
  };

  return (
    <div className="card-section feedback-summary-card">
      <h4 className="card-title">✏️ Edit Feedback Summary</h4>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label>Bio</label>
        <input
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="form-group">
        <label>Expertise</label>
        <input
          type="text"
          name="expertise"
          value={form.expertise}
          onChange={handleChange}
          placeholder="E.g. Frontend Development, UX"
        />
      </div>

      <div className="form-group checkbox-inline">
        <label>
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />
        Available for mentoring
        </label>
      </div>

      <button className="primary-btn" onClick={handleSubmit}>
        Save Changes 
      </button>
    </div>
  );
};

export default EditableFeedbackSummary;
