import React, { useEffect, useState } from "react";
import Sidebar from "../components/mentorComponents/Sidebar";
import Topbar from "../components/mentorComponents/Topbar";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../main.scss";

const AcceptedRequests = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "mentorship_requests"),
      where("mentorId", "==", user.uid),
      where("status", "==", "accepted")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMentees(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="main-section">
          <h1 className="dasboard-title">Accepted Mentees</h1>
          {loading ? (
            <p>Loading mentees...</p>
          ) : mentees.length === 0 ? (
            <p className="no-requests">No accepted mentees yet.</p>
          ) : (
            <ul className="requests-list">
              {mentees.map((mentee) => (
                <li key={mentee.id} className="request-item">
                  <div className="request-info">
                    <h3>{mentee.name || "Unnamed Mentee"}</h3>
                    <p><strong>Interest:</strong> {mentee.areaOfInterest || "N/A"}</p>
                    <p><strong>Date:</strong> {mentee.date || "Unknown"}</p>
                    {mentee.message && (
                      <p><strong>Message:</strong> {mentee.message}</p>
                    )}
                  </div>
                  <button className="message-btn" onClick={() => navigate(`/mentordashboard/chat/${mentee.menteeId}`)}>Message 💬</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptedRequests;
