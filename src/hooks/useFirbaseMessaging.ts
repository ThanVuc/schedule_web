import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { globalConfig } from "@/global/global";
import { MeModel } from "@/models";
import { useAppNotification } from "./useNotification";
import { FcmTokenModel } from "@/models/fcm";
import { NotificationApiUrl } from "@/api";
import { useAxiosMutationAvoidRC } from "./useAxios";

export function useFirebaseMessaging(me?: MeModel | null, csrfToken?: string | null) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
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
                    if (token === lastToken) {
                        return;
                    }

                    const resp = await sendRequest<FcmTokenModel>({
                        url: NotificationApiUrl.upsertFcmToken,
                        method: "POST",
                        payload: {
                            fcm_token: token,
                            device_id: navigator.userAgent,
                        }
                    });

                    if (resp.error) {
                        console.error("FCM token registration failed:", resp.error);
                    }

                    localStorage.setItem("fcm_token", token);
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
            console.log("📩 Foreground message:", payload);
            const { title, body, url, src } = payload.data || {};
            if (title && body) {
                showNotification({
                    title,
                    body,
                    url,
                    src,
                });
            }
        });

        return unsubscribe;
    }, [me, showNotification, sendRequest, csrfToken]);

    return { fcmToken, NotificationComponent };
}
