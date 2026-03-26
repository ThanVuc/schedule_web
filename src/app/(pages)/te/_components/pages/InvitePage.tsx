"use client";

import InviteApiUrl from "@/api/invite.api";
import { useCsrfToken } from "@/context/csrf.context";
import { useAxiosMutation } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const InvitePage = () => {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const csrfToken = useCsrfToken();


    const { sendRequest } = useAxiosMutation(
        {
            method: 'POST',
            url: InviteApiUrl.acceptance,
        }
    );

    useEffect(() => {
        if (!code || !csrfToken) {
            return;
        }

        sendRequest({
            data: {
                code: code
            }
        });

    }, [code, csrfToken]);

    return (
        <>
            <div>Đang chuyển hướng đến nhóm của bạn, vui lòng chờ...</div>
        </>
    );
}
