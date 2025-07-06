const { db, admin } = require('../config/firebaseAdmin');

// ✅ POST /api/admin/assign
const assignMentor = async (req, res) => {
  const { studentId, mentorId, assignedBy } = req.body;

  if (!studentId || !mentorId || !assignedBy) {
    return res.status(400).json({ message: 'Missing studentId, mentorId, or assignedBy' });
  }

  try {
    // 1️⃣ Save assignment record
    await db.collection('assignments').add({
      studentId,
      mentorId,
      assignedBy,
      assignedAt: new Date()
    });

    // 2️⃣ Update student profile
    await db.collection('users').doc(studentId).update({
      assignedMentorId: mentorId,
      assigned: true,
      updatedAt: new Date()
    });

    // 3️⃣ Update mentor profile
    await db.collection('users').doc(mentorId).update({
      hasAssignedStudents: true,
      updatedAt: new Date()
    });

    // 4️⃣ Update or create mentorRequest
    const existingReqSnap = await db.collection('mentorRequests')
      .where('studentId', '==', studentId)
      .get();

    if (!existingReqSnap.empty) {
      const docRef = existingReqSnap.docs[0].ref;
      await docRef.update({
        to: mentorId,
        status: 'accepted',
        updatedAt: new Date()
      });
    } else {
      await db.collection('mentorRequests').add({
        studentId,
        to: mentorId,
        status: 'accepted',
        createdAt: new Date()
      });
    }

    res.status(201).json({ message: 'Mentor assigned successfully' });
  } catch (error) {
    console.error('❌ Error assigning mentor:', error);
    res.status(500).json({ message: 'Assignment failed', error: error.message });
  }
};

// ✅ GET /api/admin/assignments
const getAllAssignments = async (req, res) => {
  try {
    const snapshot = await db.collection('assignments')
      .orderBy('assignedAt', 'desc')
      .get();

    const assignments = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Defensive checks in case of incomplete or bad data
      const studentId = data.studentId || null;
      const mentorId = data.mentorId || null;
      const assignedBy = data.assignedBy || null;

      const [studentSnap, mentorSnap, adminSnap] = await Promise.all([
        studentId ? db.collection('users').doc(studentId).get() : null,
        mentorId ? db.collection('users').doc(mentorId).get() : null,
        assignedBy ? db.collection('users').doc(assignedBy).get() : null
      ]);

      assignments.push({
        id: doc.id,
        studentId,
        studentName: studentSnap?.exists ? studentSnap.data().name : 'Unknown',
        mentorId,
        mentorName: mentorSnap?.exists ? mentorSnap.data().name : 'Unknown',
        assignedBy,
        assignedByName: adminSnap?.exists ? adminSnap.data().name : 'Unknown',
        assignedAt: data.assignedAt
      });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error('❌ Error fetching enriched assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
};

module.exports = {
  assignMentor,
  getAllAssignments
};
