"use client";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/components/ui";
import { useNotification } from "@/context/notification.context";
import { cn } from "@/lib/utils";
import { CaculateTimeFromTimeToNow } from "@/utils";
import { Bell, BellIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const AppBellNotification = () => {
    const { markAllAsRead, markAsRead, notifications } = useNotification();
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const filteredNotifications = useMemo(() => {
        return activeTab === "unread"
            ? notifications.filter(n => !n.is_read)
            : notifications;
    }, [notifications, activeTab]);

    const newNotifications = useMemo(
        () => filteredNotifications.filter(n => !n.is_read),
        [filteredNotifications]
    );

    const earlierNotifications = useMemo(
        () => filteredNotifications.filter(n => n.is_read),
        [filteredNotifications]
    );

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 cursor-pointer rounded-full bg-[#0f1421] text-gray-400 transition-colors hover:!bg-cyan-500/10 hover:!text-cyan-400">
                        <BellIcon className="w-6 h-6" />
                        {newNotifications.length > 0 && (
                            <Badge className="absolute -top-1 -right-1 w-4 h-4 text-white bg-cyan-500">
                                {newNotifications.length}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-100 p-0 border-cyan-900/30 bg-[#0a0e1a] shadow-2xl shadow-cyan-500/5">
                    <div>
                        <div className="notifications-header p-4">
                            <h2 className="text-xl font-semibold mb-3">Thông Báo</h2>
                            <div className="read-tabs">
                                <Button
                                    onClick={() => setActiveTab("all")}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                                        activeTab === "all" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-cyan-400",
                                    )}>Tất cả</Button>
                                <Button
                                    onClick={() => setActiveTab("unread")}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                                        activeTab === "unread" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-cyan-400",
                                    )}>Chưa đọc {newNotifications.length > 0 ? <Badge className="ml-2 text-cyan-400 bg-cyan-500/20">{newNotifications.length}</Badge> : null}</Button>
                            </div>
                        </div>
                        <ScrollArea className="h-90">
                            <div className="px-2 py-2">
                                {/* New Section */}
                                {newNotifications.length > 0 && (
                                    <div className="mb-2">
                                        <div className="mb-2 flex items-center justify-between px-2 py-1">
                                            <h3 className="text-sm font-semibold text-gray-400">Mới</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={markAllAsRead}
                                                disabled={newNotifications.length === 0}
                                                className="h-auto p-0 text-xs text-cyan-400 hover:bg-transparent hover:text-cyan-300"
                                            >
                                                Xem tất cả
                                            </Button>
                                        </div>
                                        {newNotifications.map((notification) => (
                                            <NotificationItem key={notification.id}
                                                notification={
                                                    {
                                                        id: notification.id,
                                                        title: notification.title,
                                                        message: notification.message,
                                                        trigger_at: CaculateTimeFromTimeToNow(notification.trigger_at),
                                                        is_read: notification.is_read,
                                                        img_url: notification.image_url,
                                                    }
                                                }
                                                onMarkAsRead={markAsRead} />
                                        ))}
                                    </div>
                                )}

                                {/* Earlier Section */}
                                {earlierNotifications.length > 0 && (
                                    <div>
                                        <div className="mb-2 px-2 py-1">
                                            <h3 className="text-sm font-semibold text-gray-400">Trước đó</h3>
                                        </div>
                                        {earlierNotifications.map((notification) => (
                                            <NotificationItem key={notification.id}
                                                notification={{
                                                    id: notification.id,
                                                    title: notification.title,
                                                    message: notification.message,
                                                    trigger_at: CaculateTimeFromTimeToNow(notification.trigger_at),
                                                    is_read: notification.is_read,
                                                    img_url: notification.image_url,
                                                }}
                                                onMarkAsRead={markAsRead} />
                                        ))}
                                    </div>
                                )}

                                {filteredNotifications.length === 0 && (
                                    <div className="py-12 text-center">
                                        <Bell className="mx-auto mb-3 h-12 w-12 text-gray-600" />
                                        <p className="text-sm text-gray-500">Không có thông báo</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface NotificationItemProps {
    notification: {
        id: string
        title: string
        message: string
        trigger_at: string
        is_read: boolean
        img_url?: string
    }
    onMarkAsRead: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    return (
        <button
            onClick={() => {
                if (!notification.is_read) {
                    onMarkAsRead(notification.id);
                }
            }}
            className={cn(
                "group relative w-full rounded-lg px-3 py-3 text-left transition-all hover:bg-cyan-500/5",
                !notification.is_read && "bg-[#0f1421]",
            )}
        >
            <div className="flex gap-3">
                {/* Icon */}
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full")}>
                    <Avatar>
                        <AvatarImage src={notification.img_url} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <p className="mb-1 text-sm font-semibold text-white line-clamp-1">{notification.title}</p>
                    <p className="mb-1.5 text-sm text-gray-400 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-cyan-400">{notification.trigger_at}</p>
                </div>

                {/* Unread Indicator */}
                {!notification.is_read && (
                    <div className="flex shrink-0 items-start pt-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    </div>
                )}
            </div>
        </button>
    )
}