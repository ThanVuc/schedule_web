"use client";

import InviteApiUrl from "@/api/invite.api";
import { useAxiosMutation } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const InvitePage = () => {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");


    const { sendRequest } = useAxiosMutation(
        {
            method: 'POST',
            url: InviteApiUrl.acceptance,
        }
    );

    useEffect(() => {
        if (!code) {
            return;
        }

        sendRequest({
            data: {
                code: code
            }
        });

    }, [code])

    return (
        <>
            <div>Đang chuyển hướng đến nhóm của bạn, vui lòng chờ...</div>
        </>
    );
}
