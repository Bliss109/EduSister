import React, { useEffect, useState } from "react";
import Sidebar from "../components/mentorComponents/Sidebar";
import Topbar from "../components/mentorComponents/Topbar";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import EditableFeedbackSummary from "../components/mentorComponents/editFS";
import "../main.scss";

const FeedbackSummaryPage = () => {
  const [mentorInfo, setMentorInfo] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [mostCommonWords, setMostCommonWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // Get mentor profile
    const unsubscribeUser = onSnapshot(
      query(collection(db, "users"), where("uid", "==", user.uid)),
      (snapshot) => {
        const data = snapshot.docs[0]?.data();
        setMentorInfo({ ...data, docId: snapshot.docs[0].id });
      }
    );

    // Get feedback + analytics
    const unsubscribeFeedback = onSnapshot(
      query(
        collection(db, "feedback"),
        where("mentorId", "==", user.uid),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        const feedback = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFeedbackList(feedback);

        // 🔢 Compute average rating
        const avg = feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedback.length || 1);
        setAverageRating(avg.toFixed(1));

        // 🧠 Compute most common words in comments
        const allComments = feedback.map((f) => f.comment || "").join(" ");
        const words = allComments.toLowerCase().match(/\b\w+\b/g) || [];

        const stopWords = new Set([
          "the", "and", "to", "a", "of", "i", "is", "in", "it", "you", "for",
          "on", "with", "was", "this", "my", "at", "that", "so", "but", "not", "they"
        ]);

        const wordFreq = {};
        words.forEach((word) => {
          if (!stopWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });

        const sortedWords = Object.entries(wordFreq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([word]) => word);

        setMostCommonWords(sortedWords);
        setLoading(false); // ✅ Done loading here
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeFeedback();
    };
  }, []);

  const handleSave = async (updatedData) => {
    if (!mentorInfo?.docId) return;
    const ref = doc(db, "users", mentorInfo.docId);
    await updateDoc(ref, updatedData);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar mentor={mentorInfo} />
        <div className="main-section">
          <h1 className="dashboard-title">📋 Feedback Summary</h1>

          <EditableFeedbackSummary mentorData={mentorInfo} onSave={handleSave} />

          <div className="card-section">
            <h4>📊 Feedback Insights</h4>
            {loading ? (
              <p>Loading insights...</p>
            ) : (
              <>
                <p><strong>Average Rating:</strong> {averageRating} ⭐</p>
                <p><strong>Common Words in Feedback:</strong> {mostCommonWords.join(", ") || "N/A"}</p>
              </>
            )}
          </div>

          <div className="card-section">
            <h4>🗨️ Feedback Received</h4>
            {loading ? (
              <p>Loading feedback...</p>
            ) : feedbackList.length === 0 ? (
              <p>No feedback yet.</p>
            ) : (
              <ul className="feedback-list">
                {feedbackList.map((fb) => (
                  <li key={fb.id} className="feedback-item">
                    <p><strong>Rating:</strong> {fb.rating} ⭐</p>
                    <p><strong>Comment:</strong> {fb.comment || "No comment"}</p>
                    <p className="timestamp">
                      {new Date(fb.timestamp?.seconds * 1000).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummaryPage;
