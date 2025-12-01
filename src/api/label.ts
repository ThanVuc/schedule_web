
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const LabelApiUrl = {
    getListLabels: createAPI('labels/types'),
    getLabelInformation: createAPI('labels/label-per-types'),
    getDefault: createAPI('labels/default')
}

export default LabelApiUrl