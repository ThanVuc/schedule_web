import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { globalConfig } from "@/global/global";
import { MeModel } from "@/models";
import { useAppNotification } from "./useNotification";
import { FcmTokenModel } from "@/models/fcm";
import { NotificationApiUrl } from "@/api";
import { useAxiosMutationAvoidRC } from "./useAxios";
import { useNotification } from "@/context/notification.context";

export function useFirebaseMessaging(me?: MeModel | null, csrfToken?: string | null) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const notificationContext = useNotification();
    const { sendRequest } = useAxiosMutationAvoidRC(csrfToken || "");
    const {
        showNotification,
        NotificationComponent
    } = useAppNotification();

    useEffect(() => {
        if (!me) return; // User must be logged in
        if (!messaging) return;
        if (!csrfToken) return;

        const init = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    if (!messaging) {
                        return;
                    }
                    const token = await getToken(messaging, {
                        vapidKey: globalConfig.FirebaseConfig.vapidKey!,
                    });

                    if (!token) {
                        return;
                    }
                    setFcmToken(token);
                    const lastToken = localStorage.getItem("fcm_token");
                    const lastUserId = localStorage.getItem("user_id");
                    if (lastToken === token && lastUserId === me.user_id) {
                        return;
                    }

                    const resp = await sendRequest<FcmTokenModel>({
                        url: NotificationApiUrl.upsertFcmToken,
                        method: "POST",
                        payload: {
                            fcm_token: token,
                            device_id: navigator.userAgent,
                            email: me.email,
                        }
                    });

                    if (resp.error) {
                        console.error("FCM token registration failed:", resp.error);
                    }

                    localStorage.setItem("fcm_token", token);
                    localStorage.setItem("user_id", me.user_id);
                } else {
                    console.warn("❌ Notification permission denied");
                }
            } catch (err) {
                console.error("FCM initialization failed:", err);
            }
        };

        init();
        
        // Listen for foreground messages
        const unsubscribe = onMessage(messaging, (payload) => {
            const { title, body, url, src } = payload.data || {};
            if (title && body) {
                showNotification({
                    title,
                    body,
                    url,
                    src,
                    duration: 8000,
                });
                if (notificationContext && notificationContext.refetch) {
                    notificationContext.refetch();
                }
            }
        });

        return unsubscribe;
    }, [me, showNotification, sendRequest, csrfToken, notificationContext]);

    return { fcmToken, NotificationComponent };
}
