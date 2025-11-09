import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginContainer from './container/googleLogin';
import { globalConfig } from '@/global/global';

export const metadata = {
    title: 'Đăng Nhập | Schedulr',
    description: 'Đăng nhập vào Schedulr để quản lý lịch trình của bạn',
};

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={globalConfig.GoogleClientId || ''}>
        <GoogleLoginContainer />
    </GoogleOAuthProvider>
  );
}
