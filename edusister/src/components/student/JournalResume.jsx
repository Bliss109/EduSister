// src/components/student/JournalResume.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/authContext';
import '../../main.css';

const JournalResume = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [latestEntry, setLatestEntry] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'journals'),
      where('uid', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestEntry(snapshot.docs[0].data());
      } else {
        setLatestEntry(null);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleClick = () => {
    navigate('/dashboard/journals');
  };

  return (
    <div className="resume-journal-card">
      {latestEntry ? (
        <>
          <div className="resume-header">
            <h3>Pick Up Where You Left Off ✨</h3>
            <p className="resume-subtitle">{latestEntry.title || 'Untitled Entry'}</p>
          </div>

          <p className="resume-snippet">"{latestEntry.content?.substring(0, 100) || 'No preview available...'}"</p>

          <div className="resume-footer">
            <button className="resume-btn" onClick={handleClick}>✍️ Continue Writing</button>
            <span className="resume-meta">
              Last saved: {latestEntry.createdAt?.toDate().toLocaleDateString() || 'N/A'}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="resume-header">
            <h3>Start Expressing Yourself 💖</h3>
            <p className="resume-subtitle">No entries yet? Let’s begin your healing journey.</p>
          </div>

          <p className="resume-snippet">
            Writing helps your mind breathe. Let your story begin today.
          </p>

          <div className="resume-footer">
            <button className="resume-btn" onClick={handleClick}>📝 Begin Writing</button>
            <span className="resume-meta">Your space is safe & private</span>
          </div>
        </>
      )}
    </div>
  );
};

export default JournalResume;
