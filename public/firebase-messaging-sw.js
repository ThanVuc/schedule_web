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

messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: null,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
