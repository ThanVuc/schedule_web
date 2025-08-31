import { globalConfig } from "@/global/global";


const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const userApiUrl = {
    createUsers: createAPI('users'),
    updateUsers: createAPI('users'),
    deleteUsers: createAPI('users'),
    getUsers: createAPI('users'),
    getByIdUsers: createAPI('users')
};