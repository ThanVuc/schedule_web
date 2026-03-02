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

// Handle background messages (when browser closed)
messaging.onBackgroundMessage(async function (payload) {
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
    const notificationOptions = {
        body,
        icon: "/thumb.png",
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
