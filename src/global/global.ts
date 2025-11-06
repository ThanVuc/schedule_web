import { GlobalConfig } from "./setting";

export const globalConfig: GlobalConfig = {
    ApiUrlBase: process.env.NEXT_PUBLIC_API_URL_BASE ?? "http://localhost:3000/api/v1/",
    AppName: 'Schedulr',
    FirebaseConfig: {
        apiKey: "AIzaSyA5eNXCUNWBrR41fTzapq0hZLVm5IX73h8",
        authDomain: "notification-schedulr.firebaseapp.com",
        projectId: "notification-schedulr",
        storageBucket: "notification-schedulr.firebasestorage.app",
        messagingSenderId: "244910001759",
        appId: "1:244910001759:web:8b714c71679d8e988ad5ea",
        measurementId: "G-N5QGEECZHB",
        vapidKey: "BPupA3S0bMv4S2hqgrRber6SlSecjiQ-sVXdOx6MbCDUHyOKUifyPtEj2PMVfkGMFqk0c3lPZDSN95AxWyHxyhY"
    },
};
