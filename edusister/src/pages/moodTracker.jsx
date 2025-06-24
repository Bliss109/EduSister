import React, { useState, useEffect, useRef } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../main.scss";

const MoodTracker = () => {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const pdfRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await getDocs(collection(db, `users/${user.uid}/moods`));
        const data = snapshot.docs.map((doc) => doc.data());
        setEntries(data);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !mood || !note) return;

      const entry = {
        mood,
        note,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, `users/${user.uid}/moods`), entry);
      setEntries((prev) => [...prev, entry]);

      setMood("");
      setNote("");
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  const handleDownloadSummary = async () => {
    const input = pdfRef.current;
    if (!input) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffeef6",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]);
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("mood-summary.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Mood Tracker Dashboard</h1>

      <div className="dashboard-mood-section">
        <h3 className="dashboard-mood-title">
          {editingId ? "Edit Entry" : "Log Your Mood"}
        </h3>
        <input
          type="text"
          className="dashboard-mood-input"
          placeholder="Type your mood..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          list="mood-suggestions"
        />
        <datalist id="mood-suggestions">
          <option value="happy" />
          <option value="sad" />
          <option value="angry" />
          <option value="excited" />
          <option value="anxious" />
          <option value="grateful" />
          <option value="burnt out" />
          <option value="confident" />
          <option value="lonely" />
          <option value="hopeful" />
        </datalist>

        <textarea
          className="dashboard-mood-textarea"
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button className="dashboard-save-button" onClick={handleSave}>
          {editingId ? "Update Entry" : "Save Mood"}
        </button>
        <button className="dashboard-download-button" onClick={handleDownloadSummary}>
          Download Mood Summary
        </button>
      </div>

      <div className="dashboard-entries">
        <h3>Your Mood Entries</h3>
        {entries.map((entry, index) => (
          <div key={index} className="dashboard-entry">
            <p><strong>Mood:</strong> {entry.mood}</p>
            <p><strong>Note:</strong> {entry.note}</p>
            <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
            <hr />
          </div>
        ))}
      </div>

      {/* Hidden container for PDF generation */}
      <div
        ref={pdfRef}
        className="pdf-capture"
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: "600px",
          padding: "20px",
          backgroundColor: "#ffeef6",
          color: "#000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Mood Summary</h2>
        {entries.map((entry, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p><strong>Mood:</strong> {entry.mood}</p>
            <p><strong>Note:</strong> {entry.note}</p>
            <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
