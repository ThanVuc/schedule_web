import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { globalConfig } from "@/global/global";
import { MeModel } from "@/models";

export function useFirebaseMessaging(me?: MeModel | null) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        console.log("🔔 Initializing Firebase Messaging...");
        if (!me) return; // User must be logged in
        if (!messaging) return;

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

                    if (token) {
                        console.log("✅ FCM Token obtained:", token);
                        setFcmToken(token);

                        // Optional: send token to backend
                        // await fetch("/api/notifications/register", {
                        //   method: "POST",
                        //   headers: { "Content-Type": "application/json" },
                        //   body: JSON.stringify({ token }),
                        // });
                    } else {
                        console.warn("⚠️ No FCM token returned");
                    }
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

            const { title, body } = payload.notification || {};
            if (title && body) {
                alert(`Notification: ${title}\n${body}`);
            }
        });

        return unsubscribe;
    }, [me]);

    return fcmToken; // ✅ Return token so caller can use it if needed
}
