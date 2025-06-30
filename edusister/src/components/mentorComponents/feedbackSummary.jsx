import React from "react";
import "../../main.scss";

const FeedbackSummary = ({ mentor, averageRating, feedbackList, mostCommonWords }) => {
  if (!mentor) return <p>Loading profile...</p>;

  return (
    <div className="card-section feedback-summary-card">
      <h4>👤 Mentor Snapshot</h4>
      <p><strong>Name:</strong> {mentor.name || "N/A"}</p>
      <p><strong>Bio:</strong> {mentor.bio || "N/A"}</p>
      <p><strong>Expertise:</strong> {mentor.expertise || "N/A"}</p>
      <p><strong>Available:</strong> {mentor.available ? "Yes" : "No"}</p>
      
      <div className="card-section analytics-card">
        <h4>📊 Feedback Analytics</h4>
        <p><strong>Average Rating:</strong> {averageRating || "N/A"} ⭐</p>
        <p><strong>Total Feedback:</strong> {feedbackList?.length || 0}</p>
        <p><strong>Most Common Words:</strong> {mostCommonWords?.join(", ") || "N/A"}</p>
      </div>
    </div>
  );
};

export default FeedbackSummary;
