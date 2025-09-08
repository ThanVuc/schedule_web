
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const profileApiUrl = {
    getUserProfile: createAPI('profile'),
    updateUserProfile: createAPI('profile/update'),
}

export default profileApiUrl