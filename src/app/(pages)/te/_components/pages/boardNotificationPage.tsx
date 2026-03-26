'use client';

import { useState } from 'react';
import { Notification } from '../features/notification';
import NotificationHeader from '../features/notification/notificationHeader';
import NotificationList from '../features/notification/notificationList';

const initialNotifications: Notification[] = [
    {
        id: 1,
        avatar: 'tao',
        avatarBg: 'bg-purple-500',
        title: 'ghé thăm',
        description: 'mới đc bổ nhiệm làm manager',
        time: '2 giờ trc',
        read: false,
    },
    {
        id: 2,
        avatar: 'sinhcc',
        avatarBg: 'bg-green-500',
        title: 'Thành công',
        description: 'đã vẽ xong giao diện',
        time: '4 giờ trước',
        read: false,
    },
    {
        id: 3,
        avatar: 'nn',
        avatarBg: 'bg-blue-500',
        title: 'mới tạo thêm task thành công',
        description: 'mới setup đc database',
        time: '1 ngày trc',
        read: false,
    },
    {
        id: 4,
        avatar: 'vv',
        avatarBg: 'bg-orange-400',
        title: 'Sprint kết thúc',
        description: 'kết thúc sau 2 ngày',
        time: '2 ngày trc',
        read: true,
    },
    {
        id: 5,
        avatar: 'dd',
        avatarBg: 'bg-pink-500',
        title: 'Thành viên mới gia nhập',
        description: 'Alice Williams nói vs t bận r',
        time: '3 ngày trc',
        read: false,
    },
];

export default function BoardNotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <div className="py-4">
            <NotificationHeader
                unreadCount={unreadCount}
                onMarkAllAsRead={markAllAsRead}
            />
            <NotificationList
                notifications={notifications}
                onMarkAsRead={markAsRead}
            />
        </div>
    );
}