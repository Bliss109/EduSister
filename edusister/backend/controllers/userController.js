// controllers/userController.js

const { db, admin } = require('../config/firebaseAdmin');

// GET /api/admin/users?role=mentor&assigned=false
const getUsersByRole = async (req, res) => {
  const { role, assigned } = req.query;

  try {
    let queryRef = db.collection('users').where('roles', 'array-contains', role);

    // If assigned is explicitly "false", filter out assigned mentors
    if (assigned === 'false') {
      queryRef = queryRef.where('assigned', '!=', true);
    }

    queryRef = queryRef.limit(15);

    const snapshot = await queryRef.get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(users);
  } catch (err) {
    console.error('Error in getUsersByRole:', err.message);
    return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
// PATCH /api/admin/users/:id/roles
const promoteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required to promote' });
  }

  try {
    await db.collection('users').doc(id).update({
      roles: admin.firestore.FieldValue.arrayUnion(role),
      updatedAt: new Date()
    });

    return res.status(200).json({ message: `User promoted to ${role}` });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to promote user', error: err.message });
  }
};

// PATCH /api/admin/users/:id/roles/remove
const demoteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required to demote' });
  }

  try {
    await db.collection('users').doc(id).update({
      roles: admin.firestore.FieldValue.arrayRemove(role),
      updatedAt: new Date()
    });

    return res.status(200).json({ message: `User removed from role: ${role}` });
  } catch (err) {
    console.error('🔥 Demote Error:', err);
    return res.status(500).json({ message: 'Failed to demote user', error: err.message });
  }
};
// POST /api/admin/users/:id/flag
const flagUser = async (req, res) => {
  const { id } = req.params;
  const { flaggedBy, reason } = req.body;
  if (!flaggedBy) {
    return res.status(400).json({ message: 'FlaggedBy is required' });
  }

  try {
    await db.collection('users').doc(id).update({
      flagged: true,
      flaggedBy,
      flaggedAt: new Date(),
      flagReason: reason || null
    });

    return res.status(200).json({ message: 'User flagged successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to flag user', error: err.message });
  }
};
// PATCH /api/admin/users/:id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { flagged, unflaggedReason } = req.body;

  try {
    await db.collection('users').doc(id).update({
      flagged,
      unflaggedAt: new Date(),
      unflaggedReason: flagged === false ? unflaggedReason : null,
    });

    res.status(200).json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

module.exports = {
    getUsersByRole,
    promoteUser,
    demoteUser,
    updateUser,
    flagUser
};