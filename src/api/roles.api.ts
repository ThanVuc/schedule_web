
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const roleApiUrl = {
    createRole: createAPI('roles'),
    updateRole: createAPI('roles'),
    deleteRole: createAPI('roles'),
    getRoles: createAPI('roles'),
    getRoleById: createAPI('roles'),
}

export default roleApiUrl