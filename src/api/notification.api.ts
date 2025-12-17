
import { globalConfig } from '../global/global'

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const NotificationApiUrl = {
    upsertFcmToken: createAPI('notifications/upsert-fcm'),
    getNotifications: createAPI('notifications'),
    markAsRead: createAPI('notifications/mark-as-read'),
}

export default NotificationApiUrl