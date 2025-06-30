const { db, admin } = require('../config/firebaseAdmin');
const { get } = require('../routes/adminRoutes');

// GET /api/admin/users?role=mentor
const getUsersByRole = async (req, res) => {
  const { role, assigned } = req.query;

  try {
    let queryRef = db.collection('users').where('roles', 'array-contains', role);
    if (assigned === 'false') {
      queryRef = queryRef.where('assigned', '!=', true);
    }
    queryRef = queryRef.limit(15);
    const snapshot = await queryRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};


module.exports ={
    getUsersByRole
};