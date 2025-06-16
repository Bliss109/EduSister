require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5001;

// 🟢 Load service account key (from .env path)
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

// 🟢 Init Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// 🟢 Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // 🛡️ Change this in production to allow only certain origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 EduSister Admin Backend is running.');
});

// 🧪 Example admin-only route (not used by frontend)
app.get('/admin/ping', async (req, res) => {
  res.json({ message: 'Pong 🧠 from admin backend', time: new Date().toISOString() });
});

// 🔒 Example: Secure route placeholder for future admin auth
// app.use('/admin', verifyAdminMiddleware, adminRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🟢 Server listening at: http://localhost:${PORT}`);
});
