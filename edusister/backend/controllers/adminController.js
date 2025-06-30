const { db, admin } = require('../config/firebaseAdmin');

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

// POST /api/admin/content
const addMotivationalContent = async (req, res) => {
  const { title, body, createdBy } = req.body;
  if (!title || !body || !createdBy) {
    return res.status(400).json({ message: 'Title, body, and createdBy are required.' });
  }

  try {
    const contentRef = await db.collection('motivational_content').add({
      title,
      body,
      createdBy,
      createdAt: new Date()
    });
    res.status(201).json({ message: 'Content added successfully', id: contentRef.id });
  } catch (err) {
    console.error('🔥 Error adding content:', err);
    res.status(500).json({ message: 'Failed to add content', error: err.message });
  }
};


module.exports ={
    getUsersByRole,
    addMotivationalContent
};
