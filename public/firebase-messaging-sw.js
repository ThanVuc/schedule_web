/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA5eNXCUNWBrR41fTzapq0hZLVm5IX73h8",
    authDomain: "notification-schedulr.firebaseapp.com",
    projectId: "notification-schedulr",
    storageBucket: "notification-schedulr.firebasestorage.app",
    messagingSenderId: "244910001759",
    appId: "1:244910001759:web:8b714c71679d8e988ad5ea",
    measurementId: "G-N5QGEECZHB"
});

const messaging = firebase.messaging();

// Handle background messages (when browser closed)
messaging.onBackgroundMessage(function (payload) {
    console.log("[Service Worker] Background message received:", payload);

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
