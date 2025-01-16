/* eslint-disable no-unused-vars */
import useOAuth from '../hooks/useOAuth';
import OAuthCallback from './OAuthCallback';
import { Link, useNavigate } from 'react-router';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../styles/login.css';
import '../index.css'
import GoogleSignInButton from './googleSignInButton';
import config from '../config';
import React, { useEffect } from 'react';

const LoginPage = () => {
  const githubToken = useOAuth();
  const navigate = useNavigate();

  // Check token on page load
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found. Staying on login page.');
        return; // No token, stay on the login page
      }

      try {
        // Validate the token with the backend
        const response = await fetch(`${config.baseURL}/authenticate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Token is valid. Redirecting to home page.', data);
          navigate('/tabs'); // Redirect to the home page
        } else {
          console.log(
            'Invalid token. Clearing token and staying on login page.'
          );
          localStorage.removeItem('token'); // Clear invalid token
        }
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token'); // Clear invalid token
      }
    };

    checkToken();
  }, [navigate]);

  const handleGoogleSignIn = async (res) => {
    try {
      console.log('Google Login Response:', res);

      // Extract the token and decode it
      const token = res.credential;

      // Optionally send the token to the backend
      const response = await fetch(`${config.baseURL}/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      // Handle the backend response
      if (!response.ok) {
        throw new Error(
          `Backend error: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log('Backend Verification Response:', data);
      // If our server returns a token, store it
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to a logged-in page
      navigate('/tabs');
    } catch (err) {
      console.error('Error verifying token:', err);
    }
  };

  const handleGithubSignIn = () => {
    console.log(import.meta.env.VITE_CLIENT_ID);

    window.location.assign(
      'https://github.com/login/oauth/authorize?client_id=' +
        import.meta.env.VITE_CLIENT_ID +
        '&scope=user:email'
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in with username and password');
  };

  return (
    <Container className='login-container'>
      {/* If user just came back from GitHub, display callback logic */}
      {githubToken ? (
        <OAuthCallback githubToken={githubToken} />
      ) : (
        <Row className='justify-content-md-center '>

          <Col xs={12} sm={10} md={8} lg={6} className="login-card">
            <div className='text-center mb-4 '>
              <h2 style={{ 
                marginTop: '10px',
                color: '#166534', 
                fontWeight: '600' 
                }}>Sign In</h2>
            </div>
            <Button
              variant='outline-secondary'
              className="w-100 mb-3 github-button"
              onClick={handleGithubSignIn}
              >
              <svg className="w-5 h-5" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" 
                  fill="currentColor"/>
              </svg>
              <span className="ms-2">Sign in with Github</span>
            </Button>
            <div className="w-100 mb-2">
            <GoogleSignInButton onGoogleSignIn={handleGoogleSignIn} />
            </div>
            <hr />
            <p>or</p>
            Sign in with your HealthTracker account
            <Form onSubmit={handleFormSubmit} className='mt-3'>
              <Form.Group className='mb-3' controlId='formUsername'>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  required
                  style={{
                    borderColor: '#E5E7EB',
                    padding: '0.5rem 0.75rem'
                  }}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  required
                  style={{
                    borderColor: '#E5E7EB',
                    padding: '0.5rem 0.75rem'
                  }}
                />
              </Form.Group>
              <Button 
                variant="success" 
                type="submit" 
                className="w-100"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#047857',
                  borderColor: '#047857',
                  fontWeight: '500'
                }}
              >
                Sign in
              </Button>
            </Form>
            <div className='text-center mt-3'>
              <p>
                Don&apos;t have an account?{' '}
                <Link 
                  to="/signup"
                  style={{
                    color: '#059669',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default LoginPage;
