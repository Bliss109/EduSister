import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../main.scss";
import { FaStaylinked } from "react-icons/fa";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      collection(db, "mentorship_requests"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const pendindOnly = data.filter((r) => r.status === "pending");
        setRequests(pendindOnly);
      },
      (error) => {
        console.error("Error fetching mentorship requests:", error);
      }
    );
    return () => unsubcribe();
  }, []);

  const handleAccept = async (id) => {
    try {
      await updateDoc(doc(db, "mentorship_requests", id), {
        status: "accepted"
    });
    }catch(error){
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="card-section pending-requests-card">
      <h4>📩 Pending Mentorship Requests</h4>
      {requests.length > 0 ? (
        <ul className="request-list">
          {requests.map((req) => (
            <li key={req.id} className="request-item">
              <div className="request-info">
                <p className="request-name">{req.name}</p>
                <p className="request-meta">
                  Interest: <strong>{req.areaOfInterest}</strong> | Date: <em>{req.date}</em>
                </p>
              </div>
              <button className="accept-btn" onClick={() => handleAccept(req.id)}>
                ✅ Accept
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-requests">No pending requests at the moment.</p>
      )}
    </div>
  );
};

export default PendingRequests;
