import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const OAuthCallback = ({ githubToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!githubToken) return;

    (async function fetchAndUpsert() {
      try {
        // GET user data from /api/oauth/github/userdata
        const userDataRes = await fetch(
          'http://localhost:3000/api/oauth/github/userdata',
          {
            headers: { Authorization: 'Bearer ' + githubToken },
          }
        );

        const githubProfile = await userDataRes.json();

        // POST to /api/oauth/github
        const upsertRes = await fetch(
          'http://localhost:3000/api/oauth/github',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              githubId: githubProfile.id,
              login: githubProfile.login,
              name: githubProfile.name,
              email: githubProfile.email,
              avatarUrl: githubProfile.avatar_url,
            }),
          }
        );
        const upsertData = await upsertRes.json();

        // If our server returns a token, store it
        if (upsertData.token) {
          localStorage.setItem('token', upsertData.token);
        }
        // Redirect to a logged-in page
        navigate('/tabs');
      } catch (err) {
        console.error('Error in fetchAndUpsert:', err);
      }
    })();
  }, [githubToken, navigate]);

  return <p>Finishing sign-in...</p>;
};

OAuthCallback.propTypes = {
  githubToken: PropTypes.string,
};

export default OAuthCallback;
