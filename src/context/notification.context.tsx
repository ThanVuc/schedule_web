import { MeModel, Notification } from "@/models";
import { createContext, useContext, useState, useEffect } from "react";
import { NotificationApiUrl } from "@/api";
import { useAxiosMutation } from "@/hooks/useAxios";
import useToastState from "@/hooks/useToasts";
import { useFirebaseMessaging } from "@/hooks/useFirbaseMessaging";

type NotificationContextType = {
  notifications: Notification[];
  refetch?: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
  initialNotifications,
  refetch,
  me,
  csrfToken,
}: {
  children: React.ReactNode;
  initialNotifications: Notification[];
  refetch: () => Promise<void>;
  me?: MeModel | null;
  csrfToken?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { setToast } = useToastState();

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const { sendRequest } = useAxiosMutation({
    url: NotificationApiUrl.markAsRead,
    method: "POST",
  });

  const markAsRead = async (id: string) => {
    const { error } = await sendRequest({ ids: [id] });
    if (error) {
      setToast({
        title: "Lỗi",
        message: "Không thể đánh dấu đã đọc thông báo",
        variant: "error",
      });
      return;
    }

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (!unreadIds.length) return;

    const { error } = await sendRequest({ ids: unreadIds });
    if (error) {
      setToast({
        title: "Lỗi",
        message: "Không thể đánh dấu tất cả đã đọc",
        variant: "error",
      });
      return;
    }

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        refetch,
      }}
    >
      <FirebaseMessagingWrapper me={me || null} csrfToken={csrfToken ?? ""} />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

export function FirebaseMessagingWrapper({
    me,
    csrfToken,
}: {
    me: MeModel | null;
    csrfToken: string;
}) {
    const { NotificationComponent } = useFirebaseMessaging(me, csrfToken);

    return NotificationComponent ? (
        <div className="fixed top-4 right-4 z-[9999]">
            {NotificationComponent}
        </div>
    ) : null;
}
