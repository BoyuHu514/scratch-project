import useOAuth from '../hooks/useOAuth';
import OAuthCallback from './OAuthCallback';
import { Link, useNavigate } from 'react-router';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../styles/login.css';
import GoogleSignInButton from './googleSignInButton';
import config from '../config';

const LoginPage = () => {
  const githubToken = useOAuth();
  const navigate = useNavigate();

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
          {/*  Normal login UI */}
          <Col md={4} className='border  rounded'>
            <div className='text-center mb-4 '>
              <h2 style={{ marginTop: '10px' }}>Sign In</h2>
            </div>
            <Button
              variant='secondary'
              className='w-100 mb-2'
              onClick={handleGithubSignIn}
            >
              Sign in with Github
            </Button>
            <GoogleSignInButton onGoogleSignIn={handleGoogleSignIn} />
            <hr />
            <p>or</p>
            Sign in with your HealthTracker account
            <Form onSubmit={handleFormSubmit} className='mt-3'>
              <Form.Group className='mb-3' controlId='formUsername'>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  required
                />
              </Form.Group>
              <Button variant='success' type='submit' className='w-100'>
                Sign in
              </Button>
            </Form>
            <div className='text-center mt-3'>
              <p>
                Don&apos;t have an account?{' '}
                <Link to='/signup'>Sign up here</Link>
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default LoginPage;
