
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

const roleApiUrl = {
    createRole: createAPI('roles'),
    updateRole: (id: string) => createAPI(`roles/${id}`),
    deleteRole: (id: string) => createAPI(`roles/${id}`),
    getRoles: createAPI('roles'),
    getRoleById: (id: string) => createAPI(`roles/${id}`),
}

export default roleApiUrl