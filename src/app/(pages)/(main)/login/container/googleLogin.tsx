"use client";
import {GoogleLogin, CredentialResponse} from '@react-oauth/google';

export const GoogleLoginContainer = () => {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const idToken  = credentialResponse.credential;
    if (!idToken) {
        console.error('No ID token received');
        return;
    }

    console.log('Login Successful', idToken);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
}

export default GoogleLoginContainer;