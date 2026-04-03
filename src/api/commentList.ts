
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const CommentListApiUrl = {
    CreateComment: createAPI('ts/groups/'),
    UpdateComment: createAPI('ts/groups/'),
    DeleteComment: createAPI('ts/groups/'),
}
export default CommentListApiUrl