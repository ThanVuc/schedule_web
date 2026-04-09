'use client';

import { useMemo } from 'react';
import { useNotification } from '@/context/notification.context';
import { Notification } from '../features/notification';
import NotificationHeader from '../features/notification/notificationHeader';
import NotificationList from '../features/notification/notificationList';

const AVATAR_COLORS = [
    'bg-purple-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-orange-400',
    'bg-pink-500',
    'bg-indigo-500',
];

const toRelativeTime = (timestamp: number) => {
    const parsedAt = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
    const diffMs = Date.now() - parsedAt;

    if (diffMs < 60_000) return 'Vừa xong';
    if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} phút trước`;
    if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)} giờ trước`;
    if (diffMs < 604_800_000) return `${Math.floor(diffMs / 86_400_000)} ngày trước`;

    return new Date(parsedAt).toLocaleDateString('vi-VN');
};

export default function BoardNotificationPage() {
    const { notifications, markAsRead, markAllAsRead } = useNotification();

    const viewNotifications = useMemo<Notification[]>(
        () =>
            notifications.map((item, index) => {
                const label = item.title?.trim() || 'Thông báo';
                const words = label.split(/\s+/).filter(Boolean);
                const avatar =
                    words.length > 1
                        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
                        : label.slice(0, 2).toUpperCase();

                return {
                    id: item.id,
                    avatar,
                    avatarBg: AVATAR_COLORS[index % AVATAR_COLORS.length],
                    title: item.title || 'Thông báo',
                    description: item.message || 'Không có nội dung',
                    time: toRelativeTime(item.trigger_at || item.created_at),
                    read: item.is_read,
                };
            }),
        [notifications]
    );

    const unreadCount = viewNotifications.filter((n) => !n.read).length;

    return (
        <div className="py-4">
            <NotificationHeader
                unreadCount={unreadCount}
                onMarkAllAsRead={markAllAsRead}
            />
            {viewNotifications.length === 0 && (
                <p className="px-10 py-8 text-sm text-gray-400">
                    Hiện chưa có thông báo nào.
                </p>
            )}
            <NotificationList
                notifications={viewNotifications}
                onMarkAsRead={markAsRead}
            />
        </div>
    );
}