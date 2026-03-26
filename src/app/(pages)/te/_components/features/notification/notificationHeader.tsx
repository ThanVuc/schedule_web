'use client';

import { Button } from '@/components/ui';

type NotificationHeaderProps = {
    unreadCount: number;
    onMarkAllAsRead: () => void;
};

export default function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b py-4 px-6">
            <div className="pl-4 pb-6">
                <h1 className="text-3xl font-bold">X Thông báo</h1>
                <p className="text-md text-gray-500 mt-0.5">
                    Luôn cập nhật thông tin về các hoạt động của nhóm bạn.
                </p>
            </div>
            {unreadCount > 0 && (
                <Button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-white hover:bg-[#F8AF18] hover:text-black bg-transparent border-1 p-4"
                >
                    Đánh dấu tất cả đã đọc
                </Button>
            )}
        </div>
    );
}