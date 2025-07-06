// controllers/moodController.js

const { db, admin } = require('../config/firebaseAdmin');

// POST /api/mood
const saveMood = async (req, res) => {
  const { uid, mood, emoji, note } = req.body;

  if (!uid || !mood || !emoji) {
    return res.status(400).json({ message: 'uid, mood, and emoji are required' });
  }

  const todayId = new Date().toISOString().split('T')[0]; // e.g., 2025-06-30

  try {
    const moodEntry = {
      mood,
      emoji,
      note: note || '',
      date: admin.firestore.Timestamp.now(),
    };

    await db.collection('users').doc(uid).collection('moods').doc(todayId).set(moodEntry);

    return res.status(201).json({ message: 'Mood saved successfully', data: moodEntry });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save mood', error: err.message });
  }
};

// GET /api/mood/:uid
const getMoodEntries = async (req, res) => {
  const { uid } = req.params;

  try {
    const snapshot = await db
      .collection('users')
      .doc(uid)
      .collection('moods')
      .orderBy('date', 'desc')
      .get();

    const moods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ moods });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch moods', error: err.message });
  }
};

module.exports = {
  saveMood,
  getMoodEntries,
};
