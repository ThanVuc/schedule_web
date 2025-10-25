
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const LabelApiUrl = {
    getListLabels: createAPI('labels/types'),
    getInformationLabels: createAPI('labels/label-per-types')
}

export default LabelApiUrl