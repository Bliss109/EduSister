const { db, admin } = require('../config/firebaseAdmin');
// POST /api/admin/notify
const sendNotification = async (req, res) => {
  const { recipientId, message, createdBy } = req.body;
  if (!recipientId || !message || !createdBy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await db.collection('notifications').add({
      recipientId,
      message,
      createdBy,
      createdAt: new Date(),
      read: false
    });

    res.status(201).json({ message: 'Notification sent' });
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};

module.exports = {
    sendNotification
};