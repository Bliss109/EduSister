import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { FaBookOpen, FaSmile, FaComments } from 'react-icons/fa';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import '../../main.css';

const StudentStats = () => {
  const { currentUser } = useAuth();
  const [journalCount, setJournalCount] = useState(0);

  // Dummy data for now (you can replace others too later)
  const dummyData = {
    moodEntries: 5,
    peerChats: 3,
  };

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'journals'), (snapshot) => {
      const userJournals = snapshot.docs.filter(
        (doc) => doc.data().uid === currentUser.uid
      );
      setJournalCount(userJournals.length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="student-stats-grid">
      <StatCard
        label={<><span className="highlight">Journal</span> Entries</>}
        count={journalCount}
        icon={<FaBookOpen />}
      />
      <StatCard
        label={<><span className="highlight">Mood</span> Entries (This Week)</>}
        count={dummyData.moodEntries}
        icon={<FaSmile />}
      />
      <StatCard
        label={<><span className="highlight">Active</span> Peer Chats</>}
        count={dummyData.peerChats}
        icon={<FaComments />}
      />
    </div>
  );
};

export default StudentStats;
