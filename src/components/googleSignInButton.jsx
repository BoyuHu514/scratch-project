import React, { useEffect } from 'react';

const GoogleSignInButton = ({ onGoogleSignIn }) => {
  useEffect(() => {
    /* Ensure the Google API is available */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: onGoogleSignIn, // Function to handle the login response
      });

      /* Render the Sign-In button */
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'), // Target element
        {
          theme: 'outline', // Button style
          size: 'large', // Button size
          class: 'g_id_signin',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left',
        }
      );
    }
  }, [onGoogleSignIn]);

  return <div id='google-signin-button'></div>; // Div for rendering the button
};

export default GoogleSignInButton;
