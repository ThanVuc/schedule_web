

interface GlobalConfig {
    ApiUrlBase: string;
    AppName: string;
}

export const globalConfig: GlobalConfig = {
    ApiUrlBase: process.env.NEXT_PUBLIC_API_URL_BASE ?? "http://localhost:3000/api/v1/",
    AppName: 'Schedulr',
};
