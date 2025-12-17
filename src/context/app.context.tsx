"use client";
import { useEffect, useState } from "react";
import { CsrfProvider } from "./csrf.context";
import { getCSRFToken } from "@/lib/utils";
import { MeProvider } from "./me.context";
import { MeModel } from "@/models/me";
import { useAxios } from "@/hooks";
import { NotificationApiUrl, utilsApiUrl } from "@/api";
import { NotificationProvider } from "./notification.context";
import { Notification } from "@/models";

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [csrfToken, setCsrfToken] = useState<string>("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await getCSRFToken();
                setCsrfToken(token || "");
            } catch {
                setCsrfToken("");
            }
        };
        fetchToken();
    }, []);

    const { data: me, error, refetch: refetchMe } = useAxios<MeModel>(
        {
            url: utilsApiUrl.getMe,
            method: "GET",
        },
        [csrfToken ?? null],
        !csrfToken
    );

    const {
        data: notificationsData,
        refetch: refetchNotifications,
    } = useAxios<{ notifications: Notification[] }>(
        {
            url: NotificationApiUrl.getNotifications,
            method: "GET",
        },
        [csrfToken ?? null],
        !csrfToken
    );

    return (
        <CsrfProvider token={csrfToken}>
            <MeProvider me={error || !me ? null : me} refetchMe={() => {
                if (refetchMe) {
                    return refetchMe();
                }
            }}>
                <NotificationProvider
                    initialNotifications={notificationsData?.notifications ?? []}
                    refetch={async () => {
                        if (refetchNotifications) {
                            await refetchNotifications();
                        }
                    }}
                    me={me}
                    csrfToken={csrfToken}
                >
                    {children}
                </NotificationProvider>
            </MeProvider>
        </CsrfProvider>
    );
}
