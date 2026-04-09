import { globalConfig } from "../global/global";

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const teSettingApiUrl = {
  getUserInfo: createAPI("ts/users"),
  updateNotificationConfig: createAPI("ts/users/configurations"),
};

export default teSettingApiUrl;
