import express from 'express';
import oauthController from '../controllers/oauthController.js';

const router = express.Router();

// Exchange code for an access token
router.get('/github/access-token', oauthController.getAccessToken);

// Get user data from GitHub using the token
router.get('/github/userdata', oauthController.getUserData);

// Upsert user in local DB
router.post('/github', oauthController.upsertUser);

router.post('/google', oauthController.googleSignin);

export default router;
