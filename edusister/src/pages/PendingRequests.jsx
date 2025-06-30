import React, { use, useEffect, useState } from "react";
import Sidebar from "../components/mentorComponents/Sidebar";
import Topbar from "../components/mentorComponents/Topbar";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDoc, addDoc, doc, query, updateDoc, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import "../main.scss";

const Pendingrequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "mentorship_requests"),
      where("mentorId", "==", user.uid),
      where("status", "==", "pending")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openModal = (id, type) => {
    setSelectedRequestId(id);
    setActionType(type);
    setShowModal(true);
  }; 

  const handleConfirm = async () => {
    if (!selectedRequestId || !actionType) return;
    try {
      const requestRef = doc(db, "mentorship_requests", selectedRequestId);
      const snapshot = await getDoc(requestRef);
      const requestData = snapshot.data();
      const newStatus = actionType === "accept" ? "accepted" : "rejected";

      await updateDoc(requestRef, { status: newStatus });

      await addDoc(collection(db, "notifications"), {
        receipientId: requestData.menteeId,
        type: "mentorship_response",
        status: newStatus,
        mentorName: requestData.mentorName || "Unknown Mentor",
        read: false,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setShowModal(false);
      setSelectedRequestId(null);
      setActionType(null);
    }
  };

  return(
  <div className="dashboard-layout">
    <Sidebar />
    <div className="main">
      <Topbar />
      <div className="main-section">
        <h1 className="dasboard-title">Pending Requests</h1>
        {loading && <p>Loading requests</p>}
        {!loading && requests.length === 0 && (
        <p className="no-requests">No pending requests</p>)}
        <ul className="requests-list">
          {requests.map((req) => (
            <li key={req.id} className="request-item">
              <div className="request-info">
                <h3>{req.name || "Unnamed user"}</h3>
                <p><strong>Interest:</strong> {req.areaOfInterest || "Not available"}</p>
                <p><strong>Date:</strong>{req.date || "Unknown"}</p>
                {req.message && (
                  <p><strong>Message: </strong>{req.message}</p>
                )}
                </div>
                <div className="action-buttons">
                  <button className="accept-btn" onClick={() => openModal(req.id, "accept")}>
                    Accept Request ✅</button>
                  <button className="decline-btn" onClick={() => openModal(req.id, "reject")}>
                    Reject Request ❌</button>
                </div>
              </li>
          ))}
        </ul>
      </div>
    </div>
    {showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Confirm {actionType === "accept" ? "Acceptance" : "Decline"}</h2>
          <p>Are you sure you want to {""}{actionType === "accept" ? "accept" : "decline"} this request?</p>
          <div className="modal-buttons">
            <button className="confirm-btn" onClick={handleConfirm}>Yes, {actionType === "accept" ? "Accept" : "Decline"}</button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </div>  
    )}  
    </div>
  );
};

export default Pendingrequests;
