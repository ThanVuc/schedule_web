interface GlobalConfig {
    ApiUrlBase: string;
    AppName: string;
}

export const globalConfig: GlobalConfig = {
    ApiUrlBase: process.env.API_URL_BASE || 'http://localhost:8080/api/v1/',
    AppName: process.env.APP_NAME || 'Schedule For You',
};