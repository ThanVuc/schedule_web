
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const NotificationApiUrl = {
    upsertFcmToken: createAPI('notifications/upsert-fcm'),
}

export default NotificationApiUrl