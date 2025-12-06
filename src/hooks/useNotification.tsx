"use client";

import { useState } from "react";
import { AppNotification } from "@/components/common";

export interface NotificationOptionProps {
    src?: string;
    alt?: string;
    title: string;
    body?: string;
    url?: string;
    onClick?: () => void;
    duration?: number; // optional, default 3s
}

// ✅ Extend with a unique ID for internal management
interface InternalNotification extends NotificationOptionProps {
    id: number;
}

export const useAppNotification = () => {
    const [notifications, setNotifications] = useState<InternalNotification[]>([]);

    const showNotification = (options: NotificationOptionProps) => {
        const id = Date.now() + Math.random();
        const item: InternalNotification = {
            ...options,
            id,
            alt: options.alt ?? "Image",
        };
        setNotifications((prev) => [...prev, item]);

        const timer = setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, options.duration ?? 7000);

        return () => clearTimeout(timer);
    };

    const hideNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const NotificationComponent = notifications.length ? (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    onClick={() => hideNotification(n.id)}
                    className="cursor-pointer animate-in fade-in duration-300"
                >
                    <AppNotification {...n} />
                </div>
            ))}
        </div>
    ) : null;

    return { showNotification, hideNotification, NotificationComponent };
};
