import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../main.scss';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';
import { useAuth } from '../context/authContext';

const StudentMentorship = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && currentUser) {
      const fetchMentors = async () => {
        setLoading(true);
        try {
          const requestsRef = collection(db, 'mentorship_requests');
          const q = query(
            requestsRef,
            where('menteeId', '==', currentUser.uid),
            where('status', '==', 'accepted')
          );
          const snapshot = await getDocs(q);

          const mentorsData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const request = docSnap.data();
              const mentorRef = doc(db, 'users', request.mentorId);
              const mentorSnap = await getDoc(mentorRef);
              return mentorSnap.exists() ? mentorSnap.data() : null;
            })
          );

          setMentors(mentorsData.filter(Boolean));
        } catch (error) {
          console.error('❌ Error fetching mentors:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMentors();
    }
  }, [authLoading, currentUser]);

  return (
    <div className="mentorship-page">
      <h2>Your Mentors</h2>

      {loading ? (
        <p>Loading mentors...</p>
      ) : mentors.length === 0 ? (
        <div className="no-connections">
          <p>You have no existing mentors.</p>
          <button className="primary-btn" onClick={() => navigate('/connect')}>
            Connect with Mentors
          </button>
        </div>
      ) : (
        <>
          <div className="profile-grid">
            {mentors.map((mentor, index) => (
              <div className="profile-card" key={index}>
                <img src={mentor.photoURL || '/default-avatar.png'} alt="avatar" />
                <h3>{mentor.name || 'Mentor'}</h3>
                <p>{mentor.role || 'Mentor'}</p>
                <button onClick={() => navigate(`/dashboard/chats?user=${mentor.uid}`)}>
                  Message
                </button>
              </div>
            ))}
          </div>
          <button className="primary-btn" onClick={() => navigate('/connect')}>
            Connect with More
          </button>
        </>
      )}
    </div>
  );
};

export default StudentMentorship;
