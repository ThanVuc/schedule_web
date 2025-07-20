interface GlobalConfig {
    ApiUrlBase: string;
    AppName: string;
}

export const globalConfig: GlobalConfig = {
    ApiUrlBase: process.env.API_URL_BASE || 'https://qa-api.eplatform.online/api/v1/',
    AppName: process.env.APP_NAME || 'Schedule For You',
};