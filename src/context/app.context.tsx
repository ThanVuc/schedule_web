"use client";
import { useEffect, useState } from "react";
import { CsrfProvider } from "./csrf.context";
import { getCSRFToken } from "@/lib/utils";
import { MeProvider } from "./me.context";
import { MeModel } from "@/models/me";
import { useAxios } from "@/hooks";
import { utilsApiUrl } from "@/api";
import { useFirebaseMessaging } from "@/hooks/useFirbaseMessaging";

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [csrfToken, setCsrfToken] = useState<string>("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await getCSRFToken();
                setCsrfToken(token || "");
            } catch (error) {
                console.error("Failed to fetch CSRF token:", error);
                setCsrfToken("");
            }
        };
        fetchToken();
    }, []);

    const { data, error, refetch } = useAxios<MeModel>({
        url: utilsApiUrl.getMe,
        method: 'GET',
    }, [csrfToken ?? null], !csrfToken);

    const { NotificationComponent } = useFirebaseMessaging(data, csrfToken);

    return (
        <CsrfProvider token={csrfToken}>
            <MeProvider me={error || !data ? null : data} refetchMe={() => {
                if (refetch) {
                    refetch();
                }
            }}>
                {children}
                {NotificationComponent && (
                    <div className="fixed top-4 right-4 z-[9999]">
                        {NotificationComponent}
                    </div>
                )}
            </MeProvider>
        </CsrfProvider>
    );
}
