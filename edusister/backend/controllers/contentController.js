const { db, admin } = require('../config/firebaseAdmin');

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
// GET /api/admin/content
const getAllMotivationalContent = async (req, res) => {
  try {
    const contentRef = db.collection('motivational_content').orderBy('createdAt', 'desc');
    const snapshot = await contentRef.get();
    const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(content);
  } catch (error) {
    console.error('❌ Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch motivational content' });
  }
};
// DELETE /api/admin/content/:id
const deleteMotivationalContent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('motivational_content').doc(id).delete();
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete content', error: err.message });
  }
};
// PATCH /api/admin/content/:id
const updateMotivationalContent = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }

  try {
    await db.collection('motivational_content').doc(id).update({
      title,
      body,
      updatedAt: new Date()
    });

    res.status(200).json({ message: 'Content updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update content', error: err.message });
  }
};

module.exports ={
    getAllMotivationalContent,
    addMotivationalContent,
    deleteMotivationalContent,
    updateMotivationalContent
}