import { globalConfig } from "@/global/global";


const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const userApiUrl = {
    assignRole: createAPI('users/assign-role'),
    getUsers: createAPI('users'),
    getByIdUsers: createAPI('users'),
    lockUser: createAPI('users/lock-user'),
};