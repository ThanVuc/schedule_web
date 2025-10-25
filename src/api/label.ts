
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const LabelApiUrl = {
    getListLabels: createAPI('labels/types')
}

export default LabelApiUrl