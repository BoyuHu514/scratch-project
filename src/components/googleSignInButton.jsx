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
          theme: 'filled_blue', // Button style
          size: 'large', // Button size
          type: 'standard', // Button type
          shape: 'rectangular', // Button shape
          text: 'signin_with', // Text displayed on the button
          logo_alignment: 'left', // Alignment of the logo
        }
      );
    }
  }, [onGoogleSignIn]);

  return <div id='google-signin-button'></div>; // Div for rendering the button
};

export default GoogleSignInButton;
