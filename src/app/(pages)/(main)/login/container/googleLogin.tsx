"use client";
import { GoogleIcon } from '@/components/icon';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import "./googleLogin.scss";
import "@/../public/assets/stars.webp";
import { useAxiosMutation } from '@/hooks';
import { authApiUrl } from '@/api';
import { useRouter } from 'next/navigation';
import useToastState from '@/hooks/useToasts';
import { useMe } from '@/context/me.context';

export const GoogleLoginContainer = () => {
  const { sendRequest } = useAxiosMutation(
    {
      method: 'POST',
      url: authApiUrl.loginWithGoogle,
    }
  );
  const router = useRouter();
  const { setToast } = useToastState();
  const meContext = useMe();

  const handleLoginSuccess = async (credentialResponse: TokenResponse) => {
    const accessToken = credentialResponse.access_token;
    if (!accessToken) {
      console.error('No ID token received');
      return;
    }

    const { error } = await sendRequest({
      google_access_token: accessToken
    })

    if (error) {
      console.error('Login failed:', error);
      return;
    }

    setToast({
      variant: 'success',
      message: 'Đăng nhập thành công!',
      title: 'Thành công',
      closeable: true,
    });
    meContext?.refetchMe();
    router.push('/');
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
          “It’s so easy to be great nowadays, my friend, because everyone else is weak”
        </blockquote>

        <figcaption className="text-gray-500 text-xs sm:text-sm">
          — David Goggins
        </figcaption>

        <p className="text-sm sm:text-base max-w-md font-semibold text-blue-400">
          Đăng Nhập để cùng nhau chinh phục những đỉnh cao mới!
        </p>
      </div>
    </div>
  );
}

export default GoogleLoginContainer;