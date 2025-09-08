import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginContainer from './container/googleLogin';

export const metadata = {
    title: 'Đăng Nhập | Schedulr',
    description: 'Đăng nhập vào Schedulr để quản lý lịch trình của bạn',
};

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
        <GoogleLoginContainer />
    </GoogleOAuthProvider>
  );
}
