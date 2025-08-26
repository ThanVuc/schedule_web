
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const authApiUrl = {
    loginWithGoogle: createAPI('auth/login-with-google'),
    logout: createAPI('auth/logout'),
    refreshToken: createAPI('auth/refresh-token'),
}
