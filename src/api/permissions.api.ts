
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const permissionApiUrl = {
    createPermission: createAPI('permissions'),
    updatePermission: createAPI('permissions'),
    deletePermission: createAPI('permissions'),
    getPermissions: createAPI('permissions'),
    getPermissionById: createAPI('permissions'),
    getResource: createAPI('permissions/resources'),
    getActions: createAPI('permissions/actions'),
}

export default permissionApiUrl