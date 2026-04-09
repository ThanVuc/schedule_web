/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDA92Ct838YA-XAiSZHn-HNhB_zcix6mnI",
    authDomain: "schedulr-notification.firebaseapp.com",
    projectId: "schedulr-notification",
    storageBucket: "schedulr-notification.firebasestorage.app",
    messagingSenderId: "117033903215",
    appId: "1:117033903215:web:4c5ef8976bdd22a7ee199a",
    measurementId: "G-ZETHPL7MN8"
});

const messaging = firebase.messaging();

const seenNotifications = new Map();
const DEDUPE_TTL_MS = 5000; // 5 seconds

function getDedupeKey(payload) {
    const data = payload?.data || {};
    const payloadMessageId = payload?.messageId || payload?.fcmMessageId || data.message_id || "";
    const correlationId = data.correlation_id || "";
    const title = data.title || "";
    const body = data.body || "";

    // Prefer correlation id for domain-level dedupe; avoid using trigger_at because tiny diffs can break dedupe.
    if (correlationId) {
        return `corr:${correlationId}|${title}|${body}`;
    }

    if (payloadMessageId) {
        return `msg:${payloadMessageId}`;
    }

    return `fallback:${title}|${body}|${data.url || ""}`;
}

function isDuplicatePush(payload) {
    const now = Date.now();
    const key = getDedupeKey(payload);
    const lastSeenAt = seenNotifications.get(key);

    // Compact stale keys opportunistically.
    for (const [existingKey, ts] of seenNotifications.entries()) {
        if (now - ts > DEDUPE_TTL_MS) {
            seenNotifications.delete(existingKey);
        }
    }

    if (lastSeenAt && now - lastSeenAt <= DEDUPE_TTL_MS) {
        return true;
    }

    seenNotifications.set(key, now);
    return false;
}

// Handle background messages (when browser closed)
messaging.onBackgroundMessage(async function (payload) {
    if (isDuplicatePush(payload)) {
        return;
    }

    const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true
    });

    clientList.forEach(client => {
        client.postMessage({
            type: "PUSH_RECEIVED_NOTIFICATION",
            payload
        });
    });

    const { title, body } = payload.data;

    // If any app tab is visible, rely on in-app handling instead of showing a second system notification.
    const hasVisibleClient = clientList.some(client => client.visibilityState === "visible");
    if (hasVisibleClient) {
        return;
    }

    const notificationTag = getDedupeKey(payload);

    // Persisted dedupe at browser notification level: skip if same tag already displayed.
    const existingNotifications = await self.registration.getNotifications({ tag: notificationTag });
    if (existingNotifications.length > 0) {
        return;
    }

    const notificationOptions = {
        body,
        icon: "/thumb.png",
        tag: notificationTag,
        renotify: false,
    };

    self.registration.showNotification(title, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url === "/" && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});
