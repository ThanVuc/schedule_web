
export interface GlobalConfig {
    ApiUrlBase: string;
    AppName: string;
    GoogleClientId: string;
    FirebaseConfig: FirebaseConfig;
}

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    vapidKey: string;
}
