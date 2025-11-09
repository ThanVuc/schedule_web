import { GlobalConfig } from "./setting";

export const globalConfig: GlobalConfig = {
    ApiUrlBase: process.env.NEXT_PUBLIC_API_URL_BASE ?? "http://localhost:3000/api/v1/",
    AppName: 'Schedulr',
    FirebaseConfig: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "",
    },
};
