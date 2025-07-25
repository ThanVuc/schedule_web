import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginContainer from './container/googleLogin';

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ''}>
        <GoogleLoginContainer />
    </GoogleOAuthProvider>
  );
}
