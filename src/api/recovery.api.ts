
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const recoveryApiUrl = {
    recovery: createAPI('works/recovery'),
}

export default recoveryApiUrl