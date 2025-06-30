import React from "react";
import "../main.scss";
import { db, auth } from "../firebase"; 
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Sidebar from "../components/mentorComponents/Sidebar";
import Topbar from "../components/mentorComponents/Topbar";
import PendingRequests from "../components/mentorComponents/pendingRequsts";
import AcceptedMentees from "../components/mentorComponents/acceptedMentees";
import ChatAccess from "../components/mentorComponents/chatAccess";
import FeedbackSummary from "../components/mentorComponents/feedbackSummary";
import MentorProfile from "../components/mentorComponents/mentorProfile";

const MentorDashboard = () => {
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const user = auth.currentUser;
      if (!user) return;
      
      const mentorRef = doc(db, "mentors", user.uid);
      const unsubcribe = onSnapshot(mentorRef, (docSnap) => {
        if (docSnap.exists()) {
          setMentorData(docSnap.data());
        } else {
          console.log("No mentor profile found.");
          setMentorData(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching mentor data:", error);
        setLoading(false);
      });
      return () => unsubcribe();
    }, []);

   if (loading) {
    return <div className="loading-screen">Loading Mentor Dashboard...</div>;
   }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar mentor={mentorData}/>
        <div className="main-section">
            <h1 className="dashboard-title">Welcome Back {mentorData?.name ?`, ${mentorData.name}` : ""} !</h1>
                <div className="dashboard-grid">
                    <PendingRequests />
                    <AcceptedMentees />
                    <ChatAccess />
                    <FeedbackSummary mentor={mentorData}/>
                    <MentorProfile mentor={mentorData}/>
                </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
