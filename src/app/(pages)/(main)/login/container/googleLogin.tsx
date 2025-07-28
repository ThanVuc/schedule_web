"use client";
import { GoogleIcon } from '@/components/icon';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import "./googleLogin.scss";
import "@/../public/assets/stars.webp";

export const GoogleLoginContainer = () => {
  const handleLoginSuccess = (credentialResponse: TokenResponse) => {
    const accessToken = credentialResponse.access_token;
    if (!accessToken) {
      console.error('No ID token received');
      return;
    }

    console.log('Login Successful', accessToken);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });


  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <button
        onClick={() => login()}
        className="google-login flex items-center justify-center"
        aria-label="Login with Google"
      >
        <GoogleIcon className="w-2/3 h-2/3" />
      </button>

      <div className="flex flex-col items-center gap-4 text-center px-4">
        <blockquote className="text-sm sm:text-base max-w-md italic text-gray-300 leading-relaxed">
          “It’s so easy to be great nowadays because everyone else is weak.”
        </blockquote>

        <figcaption className="text-gray-500 text-xs sm:text-sm">
          — David Goggins
        </figcaption>

        <p className="text-sm sm:text-base max-w-md font-semibold text-blue-400">
          Come here. Login — and outwork them.
        </p>
      </div>
    </div>
  );
}

export default GoogleLoginContainer;