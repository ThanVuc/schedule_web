'use client';

export type Notification = {
    id: number;
    avatar: string;
    avatarBg: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
};

type NotificationItemProps = {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const { id, avatar, avatarBg, title, description, time, read } = notification;

    return (
        <div
            onClick={() => onMarkAsRead(id)}
            className={`hover:bg-[#1a2332] flex items-start gap-4 p-5 px-6 border cursor-pointer
                ${read ? 'bg-[#0b1120] opacity-70' : 'bg-[#2a97ea]/5'}`}
        >
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarBg}`}
            >
                {avatar}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
                <p className="text-md font-semibold">{title}</p>
                <p className="text-sm text-gray-500 truncate">{description}</p>
                <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>

            {!read && (
                <span className="flex-shrink-0 mt-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
            )}
        </div>
    );
}