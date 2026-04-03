
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const ChecklistApiUrl = {
    CreateCheckList: createAPI('ts/groups/'),
    UpdateCheckList: createAPI('ts/groups/'),
    DeleteCheckList: createAPI('ts/groups/'),
}
export default ChecklistApiUrl