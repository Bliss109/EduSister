const { db, admin } = require('../config/firebaseAdmin');

// POST /api/admin/createOrFetchChat
const createOrFetchChat = async (req, res) => {
  const { uid1, uid2 } = req.body;
  if (!uid1 || !uid2) {
    return res.status(400).json({ message: 'Both user IDs are required' });
  }

  const chatId = [uid1, uid2].sort().join('_');
  const chatRef = db.collection('peer_chats').doc(chatId);
  const chatSnap = await chatRef.get();

  if (chatSnap.exists) {
    return res.status(200).json({ message: 'Chat already exists', chatId });
  }

  try {
    await chatRef.set({
      users: [uid1, uid2],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessage: null
    });

    return res.status(201).json({ message: 'Chat created', chatId });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create chat', error: err.message });
  }
};

module.exports ={
    createOrFetchChat
};