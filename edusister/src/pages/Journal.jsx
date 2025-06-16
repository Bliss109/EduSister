import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import '../main.css';

const Journal = () => {
  const { currentUser } = useAuth();
  const { searchQuery } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'journals'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userEntries = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((entry) => entry.uid === currentUser.uid);
      setEntries(userEntries);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content || !mood) {
      toast.error('All fields are required 💡');
      return;
    }

    try {
      if (editMode) {
        await updateDoc(doc(db, 'journals', editEntryId), {
          title,
          content,
          mood,
          updatedAt: new Date(),
        });
        toast.success('Entry updated!');
      } else {
        await addDoc(collection(db, 'journals'), {
          uid: currentUser.uid,
          title,
          content,
          mood,
          isDraft: false,
          createdAt: new Date(),
        });
        toast.success('Journal saved! 🩷');
      }

      setTitle('');
      setContent('');
      setMood('');
      setEditMode(false);
      setEditEntryId(null);
      setShowForm(false);
    } catch (err) {
      toast.error('Error saving journal 😥');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'journals', id));
      toast.success('Entry deleted 🗑️');
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const handleEdit = (entry) => {
    setEditMode(true);
    setEditEntryId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setShowForm(true);
  };

  const filteredEntries = entries.filter((entry) =>
    entry.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="journal-page">
      <div className="journal-header">
        <h1>My Journal ✍️</h1>
        <button className="journal-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : '➕ New Entry'}
        </button>
      </div>

      {showForm && (
        <form className="journal-form" onSubmit={handleSave}>
          <div className="journal-form-group">
            <label>Title</label>
            <input
              type="text"
              className="journal-textarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title"
            />
          </div>
          <div className="journal-form-group">
            <label>How are you feeling?</label>
            <select
              className="journal-select"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="">Choose a mood</option>
              <option value="😊">Happy</option>
              <option value="😔">Sad</option>
              <option value="😡">Angry</option>
              <option value="😌">Calm</option>
              <option value="😰">Anxious</option>
              <option value="🥰">Loved</option>
            </select>
          </div>
          <div className="journal-form-group">
            <label>Write your thoughts</label>
            <textarea
              className="journal-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Let it all out here..."
            />
          </div>
          <button className="journal-save-btn" type="submit">
            {editMode ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      )}

      <div className="journal-entries">
        {filteredEntries.map((entry) => (
          <div className="journal-card" key={entry.id}>
            <div className="journal-card-header">
              <span className="journal-mood">{entry.mood}</span>
              <span className="journal-date">
                {new Date(entry.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <h3 style={{ margin: '0.5rem 0', fontWeight: '600' }}>{entry.title}</h3>
            <p className="journal-snippet">{entry.content}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button className="journal-btn" onClick={() => handleEdit(entry)}>Edit</button>
              <button className="journal-btn" onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
