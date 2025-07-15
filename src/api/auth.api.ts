
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

const authApiUrl = {
    login: createAPI('login'),
    logout: createAPI('logout'),
    register: createAPI('register'),
    refreshToken: createAPI('refresh-token'),
    // Add other auth-related endpoints here
}

export default authApiUrl