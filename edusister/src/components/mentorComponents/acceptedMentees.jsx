import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import "../../main.scss";

const AcceptedMentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to view accepted mentees.");
      setLoading(false);
      return;
    }
    const unsubcribe = onSnapshot(
      collection(db, "mentorship_requests"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        const acceptedMentees = data.filter((r) => 
          r.status === "accepted" && r.mentorId === user.uid
        );        
        setMentees(acceptedMentees);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching mentees:", error);
        setError("Failed to load mentees. Please try again later.");
        setLoading(false);
      });
    return () => unsubcribe();
  }, []);

  return (
    <div className="card-section accepted-mentees-card">
      <h4>🤝 Accepted Mentees</h4>
      {loading && <p> Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && mentees.length > 0 ? (
        <ul className="mentee-list">
          {mentees.map((m) => (
            <li key={m.id} className="mentee-item">
              <div className="mentee-info">
                <p className="mentee-name">{m.name || "Unnamed Mentee"}</p>
                <p className="mentee-interest">Focus: <strong>{m.areaOfInterest || "Not specified"}</strong></p>
              </div>
              <button className="message-btn">💬 Message</button>
            </li>
          ))}
        </ul>
      ) : (
        !loading &&
        <p className="no-mentees">No accepted mentees yet.</p>
      )}
    </div>
  );
};

export default AcceptedMentees;
