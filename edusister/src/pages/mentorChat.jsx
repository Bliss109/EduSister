import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../main.scss";

const MentorChatAccess = () => {
  const [mentees, setMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "mentorship_requests"),
      where("mentorId", "==", currentUser.uid),
      where("status", "==", "accepted")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const menteesData = await Promise.all(snapshot.docs.map(async (doc) => {
        const { menteeId, menteeName } = doc.data();
        const conversationId = [currentUser.uid, menteeId].sort().join("_");

        const messageQuery = query(
          collection(db, "chats", conversationId, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const messageSnapshot = await new Promise((resolve) =>
          onSnapshot(messageQuery, resolve)
        );

        const lastMessageDoc = messageSnapshot.docs[0];
        const lastMessage = lastMessageDoc?.data()?.text || "No messages yet";
        const timestamp = lastMessageDoc?.data()?.timestamp?.toDate();
        const senderId = lastMessageDoc?.data()?.senderId;
        const unread = senderId !== currentUser.uid;

        return {
          id: menteeId,
          name: menteeName,
          lastMessage,
          timestamp,
          unread,
        };
      }));

      // Sort by unread first, then recent timestamp
      menteesData.sort((a, b) => {
        if (a.unread !== b.unread) return b.unread - a.unread;
        return b.timestamp?.getTime() - a.timestamp?.getTime();
      });

      setMentees(menteesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatTime = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const filteredMentees = mentees.filter((mentee) =>
    mentee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading chats...</div>;
  }

  if (mentees.length === 0) {
    return (
      <div className="empty-chat-state">
        <h2>Welcome Mentor 👋</h2>
        <p>
          Once you accept a mentorship request, your mentees will appear here and you can start chatting.
        </p>
        <Link to="/mentor/requests" className="cta-link">
          View Pending Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="chat-access-list">
      <h2>Your Mentees</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search mentees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul>
        {filteredMentees.map((mentee) => (
          <li
            key={mentee.id}
            className={`mentee-item ${mentee.unread ? "unread" : ""}`}
            onClick={() => navigate(`/mentor/chat/${mentee.id}`)}
          >
            <div className="mentee-avatar">
              {mentee.name.charAt(0).toUpperCase()}
            </div>
            <div className="mentee-details">
              <div className="mentee-header">
                <span className="mentee-name">{mentee.name}</span>
                <span className="mentee-time">{formatTime(mentee.timestamp)}</span>
              </div>
              <div className="mentee-snippet">{mentee.lastMessage}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorChatAccess;
