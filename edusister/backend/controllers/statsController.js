const { db, admin } = require('../config/firebaseAdmin');

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [studentsSnap, mentorsSnap, adminsSnap, assignmentsSnap] = await Promise.all([
      db.collection('users').where('roles', 'array-contains', 'student').get(),
      db.collection('users').where('roles', 'array-contains', 'mentor').get(),
      db.collection('users').where('roles', 'array-contains', 'admin').get(),
      db.collection('assignments').get()
    ]);

    return res.status(200).json({
      totalStudents: studentsSnap.size,
      totalMentors: mentorsSnap.size,
      totalAdmins: adminsSnap.size,
      totalAssignments: assignmentsSnap.size,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

// GET /api/admin/assignments/stats
const getAssignmentStats = async (req, res) => {
  try {
    const snapshot = await db.collection('assignments').get();

    const total = snapshot.size;
    const studentSet = new Set();
    const mentorSet = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.studentId) studentSet.add(data.studentId);
      if (data.mentorId) mentorSet.add(data.mentorId);
    });

    return res.status(200).json({
      total,
      uniqueStudents: studentSet.size,
      uniqueMentors: mentorSet.size
    });
  } catch (err) {
    console.error('❌ Failed to get assignment stats:', err);
    return res.status(500).json({ message: 'Failed to get assignment stats', error: err.message });
  }
};

module.exports = {
    getAdminStats,
    getAssignmentStats
}