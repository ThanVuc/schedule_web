import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import { globalConfig } from "@/global/global";

const firebaseConfig = {
    apiKey: globalConfig.FirebaseConfig.apiKey!,
    authDomain: globalConfig.FirebaseConfig.authDomain!,
    projectId: globalConfig.FirebaseConfig.projectId!,
    storageBucket: globalConfig.FirebaseConfig.storageBucket!,
    messagingSenderId: globalConfig.FirebaseConfig.messagingSenderId!,
    appId: globalConfig.FirebaseConfig.appId!,
    measurementId: globalConfig.FirebaseConfig.measurementId!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let messaging: Messaging | undefined;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, messaging, getToken, onMessage };
