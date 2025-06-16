require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

console.log('FIREBASE_SERVICE_ACCOUNT_KEY_PATH:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204 
}));

app.use(express.json());

/**
 * PATCHED SIGNUP ROUTE
 * - Verifies the frontend-generated ID token
 * - Stores user profile (email + fullName) in Firestore
 */
app.post('/api/signup', async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    const { fullName } = req.body;

    if (!idToken || !fullName) {
        return res.status(400).json({ error: 'ID token and full name are required.' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        await db.collection('users').doc(uid).set({
            email,
            fullName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`✅ User registered: ${uid}`);
        return res.status(201).json({ 
            uid,
            email,
            fullName,
            message: 'User created successfully in Firestore.'
        });

    } catch (error) {
        console.error('❌ Error in /signup:', error);
        return res.status(500).json({ message: 'Signup failed.', error: error.message });
    }
});

/**
 * PATCHED LOGIN ROUTE
 * - Verifies ID token
 * - Returns user profile from Firestore
 */
app.post('/api/login', async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(400).json({ error: 'ID token is required.' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        console.log(`✅ Login successful for: ${uid}`);
        return res.status(200).json({
            uid,
            email,
            fullName: userData?.fullName || decodedToken.name || null,
            message: 'Login verified successfully.'
        });

    } catch (error) {
        console.error('❌ Error in /login:', error);
        return res.status(401).json({ message: 'Invalid ID token.', error: error.message });
    }
});

/**
 * LOGOUT ROUTE — REVOKE REFRESH TOKENS
 */
app.post('/api/logout', async (req, res) => {
    const idToken = req.body.idToken;

    if (!idToken) {
        return res.status(400).json({ error: 'ID token is required.' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        await auth.revokeRefreshTokens(uid);
        console.log(`✅ Revoked refresh tokens for: ${uid}`);
        return res.status(200).json({ message: 'Logout successful.' });

    } catch (error) {
        console.error('❌ Error in /logout:', error);
        return res.status(500).json({ message: `Logout failed: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
