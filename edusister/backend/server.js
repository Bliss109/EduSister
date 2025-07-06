const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route (optional homepage)
app.get('/', (req, res) => {
  res.send('🎉 Admin backend is running!');
});
const moodRoutes = require('./routes/moodRoutes');
app.use('/api/mood', moodRoutes);
// Admin API routes
const adminRoutes = require('./routes/adminRoutes'); 
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Admin backend running on http://localhost:${PORT}`);
});
