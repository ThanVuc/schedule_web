import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const worksApiUrl = {
    createWork: createAPI('works'),
    getWork: createAPI('works'),
    updateWork: createAPI('works'),
    getWorkById: createAPI('works'),
    deleteWork: createAPI('works'),
    deleteWorkDraft: createAPI('works/drafts'),
    acceptWorkDraft: createAPI('works/drafts'),
    getGoal: createAPI('goals/dialog/list'),
    generation: createAPI('works/generation'),
}
