"use client";

import { useCallback, useRef, useState } from "react";
import { AppNotification } from "@/components/common";

export interface NotificationOptionProps {
    src?: string;
    alt?: string;
    title: string;
    body?: string;
    url?: string;
    onClick?: () => void;
    duration?: number; // optional, default 3s
    dedupeKey?: string;
}

// ✅ Extend with a unique ID for internal management
interface InternalNotification extends NotificationOptionProps {
    id: number;
}

export const useAppNotification = () => {
    const [notifications, setNotifications] = useState<InternalNotification[]>([]);
    const dedupeMapRef = useRef<Map<string, number>>(new Map());
    const DEDUPE_TTL_MS = 15000;

    const buildFallbackDedupeKey = useCallback((options: NotificationOptionProps) => {
        return `${options.title || ""}|${options.body || ""}|${options.url || ""}`;
    }, []);

    const showNotification = useCallback((options: NotificationOptionProps) => {
        const now = Date.now();
        const dedupeKey = options.dedupeKey || buildFallbackDedupeKey(options);

        for (const [key, timestamp] of dedupeMapRef.current.entries()) {
            if (now - timestamp > DEDUPE_TTL_MS) {
                dedupeMapRef.current.delete(key);
            }
        }

        const lastShownAt = dedupeMapRef.current.get(dedupeKey);
        if (lastShownAt && now - lastShownAt <= DEDUPE_TTL_MS) {
            return () => undefined;
        }

        dedupeMapRef.current.set(dedupeKey, now);

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
    }, [buildFallbackDedupeKey]);

    const hideNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

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
