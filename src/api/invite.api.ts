
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const InviteApiUrl = {
    Acceptance: createAPI('ts/groups/invitation/acceptance'),
}
export default InviteApiUrl
