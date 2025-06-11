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

app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
        optionsSuccessStatus: 204 
    }
));
app.use(express.json());
app.post('/api/signup', async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
        return res.status(400).send({ error: 'Email, password, and full name are required.' });
    }
    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: fullName,
        });
        await db.collection('users').doc(userRecord.uid).set({
            email: email,
            fullName: fullName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`User created: ${userRecord.uid}`);
        return res.status(201).json({ 
            uid: userRecord.uid, 
            email: userRecord.email,
            message: 'User created successfully.'
         });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        else if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        else if (error.code === 'auth/weak-password') {
            return res.status(400).json({ message: 'Password is too weak.' });
        }
        else{
            return res.status(500).json({ message: `Signup failed: ${error.message}`});
        }
    }
});
app.post('/api/login', async (req, res) => {
    const idToken = req.body.idToken;
    if (!idToken) {
        return res.status(400).json({ error: 'ID token is required.' });
    }
    try{
        const dedcodedToken = await auth.verifyIdToken(idToken);
        const uid = dedcodedToken.uid;
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.exists ? userDoc.data() : null;
        console.log(`User logged in: ${uid}`);
        return res.status(200).json({
            uid: uid,
            email: dedcodedToken.email,
            fullName: userData.fullName || dedcodedToken.displayName,
            message: 'Login successful.'
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        return res.status(401).json({ message: 'Invalid ID token.' });
    }
});
app.post('/api/logout', async (req, res) => {
    const idToken = req.body.idToken;
    if (!idToken) {
        return res.status(400).json({ error: 'ID token is required.' });
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        await auth.revokeRefreshTokens(uid);
        console.log(`Reveoked refresh tokens for user: ${uid}`);
        return res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({ message: `Logout failed: ${error.message}` });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

