'use client';

import NotificationItem, { Notification } from './notificationItem';

type NotificationListProps = {
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
};

export default function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
    return (
        <div>
            {notifications.map((notif) => (
                <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={onMarkAsRead}
                />
            ))}
        </div>
    );
}