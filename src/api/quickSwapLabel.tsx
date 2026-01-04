
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const quickSwapLabelApiUrl = {
    quickSwapLabel: createAPI('works'),
}

export default quickSwapLabelApiUrl