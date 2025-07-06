// src/controllers/mentorController.js
const { db } = require('../config/firebaseAdmin');

// ✅ GET /api/mentor/:mentorId/stats
const getMentorStats = async (req, res) => {
  const { mentorId } = req.params;

  try {
    // Count from mentorRequests for pending
    const pendingSnap = await db.collection('mentorRequests')
      .where('to', '==', mentorId)
      .where('status', '==', 'pending')
      .get();

    // Count from assignments for accepted mentees
    const acceptedSnap = await db.collection('assignments')
      .where('mentorId', '==', mentorId)
      .get();

    res.status(200).json({
      pendingCount: pendingSnap.size,
      acceptedCount: acceptedSnap.size
    });
  } catch (err) {
    console.error('❌ Error fetching mentor stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

// ✅ GET /api/mentor/:mentorId/mentees
const getAcceptedMentees = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const snap = await db.collection('mentorRequests')
      .where('mentorId', '==', mentorId)
      .orderBy('assignedAt', 'desc')
      .get();

    const mentees = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      const studentSnap = await db.collection('users').doc(data.studentId).get();

      mentees.push({
        id: doc.id,
        studentId: data.studentId,
        studentName: studentSnap.exists ? studentSnap.data().name : 'Unknown',
        assignedAt: data.assignedAt
      });
    }

    res.status(200).json(mentees);
  } catch (err) {
    console.error('❌ Error fetching accepted mentees:', err);
    res.status(500).json({ message: 'Failed to fetch mentees', error: err.message });
  }
};

// 🔄 Leave the rest unchanged

const getPendingRequests = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const snap = await db.collection('mentorRequests')
      .where('to', '==', mentorId)
      .where('status', '==', 'pending')
      .get();

    const requests = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      const studentSnap = await db.collection('users').doc(data.studentId).get();

      requests.push({
        id: doc.id,
        studentId: data.studentId,
        studentName: studentSnap.exists ? studentSnap.data().name : 'Unknown',
        note: data.note,
        createdAt: data.createdAt
      });
    }

    res.status(200).json(requests);
  } catch (err) {
    console.error('❌ Error fetching mentor requests:', err);
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

const respondToMentorRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const ref = db.collection('mentorRequests').doc(requestId);
    await ref.update({ status });
    res.status(200).json({ message: `Request ${status}` });
  } catch (err) {
    console.error('❌ Error responding to request:', err);
    res.status(500).json({ message: 'Failed to update request', error: err.message });
  }
};

const getMentorProfile = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const snap = await db.collection('users').doc(mentorId).get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const data = snap.data();
    res.status(200).json({
      name: data.name,
      email: data.email,
      bio: data.bio || '',
      expertise: data.expertise || [],
      photoBase64: data.photoBase64 || null
    });
  } catch (err) {
    console.error('❌ Error fetching mentor profile:', err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

const updateMentorProfile = async (req, res) => {
  const { mentorId } = req.params;
  const updates = req.body;

  try {
    await db.collection('users').doc(mentorId).set(updates, { merge: true });
    res.status(200).json({ message: 'Profile updated' });
  } catch (err) {
    console.error('❌ Error updating mentor profile:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

module.exports = {
  getMentorStats,
  getPendingRequests,
  respondToMentorRequest,
  getAcceptedMentees,
  getMentorProfile,
  updateMentorProfile
};
