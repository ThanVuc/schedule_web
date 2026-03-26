
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const InviteApiUrl = {
    acceptance: createAPI('invitation/acceptance'),
}
export default InviteApiUrl
