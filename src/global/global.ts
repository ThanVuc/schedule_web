interface GlobalConfig {
    ApiUrlBase: string;
    AppName: string;
}

export const globalConfig: GlobalConfig = {
    ApiUrlBase: process.env.NEXT_PUBLIC_API_URL_BASE ?? "123",//|| 'https://qa-api.eplatform.online/api/v1/',
    AppName: process.env.APP_NAME || 'Schedulr',
};