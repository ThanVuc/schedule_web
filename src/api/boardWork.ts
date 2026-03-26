import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const boardWorksApiUrl = {
    GetBoardWorks: createAPI('ts/Works/'),
    UpdateBoardWork: createAPI('ts/Works/'),
    GetListSprint: createAPI('ts/groups/{group_id}/sprints'),
}
