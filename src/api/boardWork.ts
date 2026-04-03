import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const boardWorksApiUrl = {
    GetBoardWorks: createAPI('ts/groups/'),
    UpdateBoardWork: createAPI('ts/groups/'),
    GetListSprint: createAPI('ts/groups/'),
    GetListUser: createAPI('ts/groups/'),
    GetListWork: createAPI('ts/groups/'),
    CRUDWORD: createAPI('ts/groups/'),
}
