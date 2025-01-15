import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Github OAuth Client Credentials
const CLIENT_ID = process.env.VITE_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const oauthController = {};

oauthController.getAccessToken = async (req, res) => {
  try {
    // User's one time use access token
    const { code } = req.query;
    // Build the query string for GitHub token exchange
    const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

    // Send GitHub our applications OAuth credentials
    const response = await fetch(
      'https://github.com/login/oauth/access_token' + params,
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
      }
    );
    const data = await response.json();
    // Log the access token response to see what GitHub returned
    console.log('Access token response from GitHub:', data);
    // Send the same data back to the client as JSON
    return res.json(data);
  } catch (err) {
    // Log any error that occurred during the fetch
    console.error('Error retrieving access token:', err);
    return res.status(500).json({ error: 'Failed to fetch GitHub user data' });
  }
};

oauthController.getUserData = async (req, res) => {
  const authorizationHeader = req.get('Authorization');
  try {
    // Ask GitHub for the user's account information
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      // Forward the Authorization header to GitHub
      headers: { Authorization: authorizationHeader },
    });
    const data = await response.json();
    // Log the user's GitHub profile information
    console.log('GitHub user data:', data);
    return res.json(data);
  } catch (err) {
    // Log any error that occurred while fetching user data
    console.error('Error retrieving user data:', err);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

oauthController.upsertUser = async (req, res) => {
  try {
    const { githubId, login, email, avatarUrl, name } = req.body;
    if (!githubId) {
      return res
        .status(400)
        .json({ error: 'Missing GitHub user ID in request body.' });
    }

    let user = await User.findOne({ githubId });
    if (!user) {
      user = new User({
        githubId,
        email,
        name: name || login,
        avatarUrl,
        password: undefined,
      });
      await user.create();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      success: true,
      user: {
        _id: user._id,
        githubId: user.githubId,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (err) {
    console.error('Error in /github upsert route:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Google OAuth Client Credentials
oauthController.googleSignin = async (req, res) => {
  const { token } = req.body;
  console.log('in google signin \n ', token);

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify the token with Google's API using fetch
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    if (!response.ok) {
      console.log('Failed to verify Google token by Google Api');
      throw new Error('Failed to verify Google token by Google Api');
    }
    console.log(response);

    const googleData = await response.json();
    console.log(googleData);

    const { email, name, picture, sub: googleId } = googleData;

    // console.log('Verified User:', { email, name, picture, googleId });

    let user = await User.findOne({ email });
    console.log('user: ', user);

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await User.create({
        name,
        email,
        provider: 'google',
        googleId, // Google-specific user ID whitch is  sub in payload of token
        avatarUrl: picture,
      });
    }
    console.log('userCreated: ', user);

    // generate a session token for your app, it is optinal, just to be flexible to manage the claims
    const appToken = jwt.sign(
      { userId: user._id, username: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    // Respond with user data and session token
    res.status(200).json({
      message: 'User authenticated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: appToken, // Your app's session token
    });
  } catch (error) {
    console.error('Error Signin Google:', error);
    res.status(401).json({ message: `Error Signin Google: ${error}` });
  }
};

export default oauthController;
