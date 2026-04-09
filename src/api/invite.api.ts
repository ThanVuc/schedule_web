import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const InviteApiUrl = {

    createInvite: (groupId: string) => createAPI(`ts/groups/${groupId}/invites`),

    acceptance: createAPI('ts/groups/invitation/acceptance'),
}

export default InviteApiUrl