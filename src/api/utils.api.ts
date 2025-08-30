import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const utilsApiUrl = {
    getCSRFToken: createAPI('auth/csrf-token'),
    getMe: createAPI('auth/me'),
}

export default utilsApiUrl