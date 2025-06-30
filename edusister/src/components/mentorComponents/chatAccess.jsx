import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import "../../main.scss";

const ChatAccess = () => {
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const unsubcribe = onSnapshot(
      collection(db, "mentorship_requests"),
      (snapshot) => {
        const accepted = snapshot.docs.filter((doc) => 
          doc.data().status === "accepted" && doc.data().mentorId === user.uid
        )
      .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentees(accepted);
      },
      (error) => {
        console.error("Error fetching mentees:", error);
      }
    );
    return () => unsubcribe();
  }, []);

  const handleSend = async () => {
    if (!selectedMentee || !message.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: getAuth().currentUser.uid,
        receipientId: selectedMentee,
        text: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 2000);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

  return (
    <div className="card-section chat-access-card">
      <h4>💬 Message a Mentee</h4>
      <div className="chat-form">
        <select
          value={selectedMentee}
          onChange={(e) => setSelectedMentee(e.target.value)}
          className="mentee-select"
        >
          <option value="">Select Mentee</option>
          {mentees.map((m) => (
            <option key={m.id} value={m.menteeId}>
              {m.name || "Unnamed Mentee"}
            </option>
          ))}
        </select>

        <textarea
          className="chat-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!selectedMentee || !message.trim()}
        >
          🚀 Send Message
        </button>

        {sent && <span className="chat-sent">✅ Message sent!</span>}
      </div>
    </div>
  );
};

export default ChatAccess;
