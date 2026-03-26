
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const ChecklistApiUrl = {
    CreateCheckList: createAPI('Works/'),
    UpdateCheckList: createAPI('ts/checklists'),
}
export default ChecklistApiUrl