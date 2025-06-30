import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/authContext";
import "../main.scss";

const ConnectPage = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [ratedMentorId, setRatedMentorId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const q = query(collection(db, "users"), where("public", "==", true));
      const querySnapshot = await getDocs(q);
      const publicUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(publicUsers.filter(u => u.id !== currentUser.uid));
    };

    fetchUsers();
  }, [currentUser]);

  const handleConnect = async (targetId) => {
    const userDoc = doc(db, "users", currentUser.uid, "connections", targetId);
    const targetDoc = doc(db, "users", targetId, "connections", currentUser.uid);

    const targetSnap = await getDoc(doc(db, "users", targetId));
    const targetData = targetSnap.data();

    await setDoc(userDoc, targetData);
    await setDoc(targetDoc, {
      displayName: currentUser.displayName,
      role: "student",
      photoURL: currentUser.photoURL || "",
    });

    alert("Connection made!");
  };

  const handleRate = async (mentorId) => {
    if (!rating || !comment.trim()) {
      alert("Please provide a rating and comment.");
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        mentorId,
        userId: currentUser.uid,
        rating,
        comment,
        timestamp: serverTimestamp(),
      });

      setRatedMentorId(mentorId);
      setRating(0);
      setComment("");
      setSuccessMessage("Thanks for your feedback!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Error submitting feedback.");
    }
  };

  return (
    <div className="connect-page">
      <h2>Explore Mentor Profiles</h2>
      <div className="profile-grid">
        {users.map((user, index) => (
          <div className="profile-card" key={index}>
            <img src={user.photoURL || "/default-avatar.png"} alt="avatar" />
            <h3>{user.displayName}</h3>
            <p>{user.role}</p>

            <button className="primary-btn" onClick={() => handleConnect(user.id)}>
              Connect
            </button>

            {currentUser?.role === "student" && user.role === "mentor" && ratedMentorId !== user.id && (
              <div className="rate-form">
                <h4>⭐ Rate This Mentor</h4>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? "selected" : ""}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {star <= (hover || rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                <textarea
                  placeholder="Leave a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button className="primary-btn" onClick={() => handleRate(user.id)}>
                  Submit Feedback
                </button>

                {successMessage && <p className="success-message">{successMessage}</p>}
              </div>
            )}

            {ratedMentorId === user.id && (
              <p className="success-message">✅ You’ve rated this mentor.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectPage;
