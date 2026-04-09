"use client";

import InviteApiUrl from "@/api/invite.api";
import { useCsrfToken } from "@/context/csrf.context";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


type AcceptanceResponse = {
    location?: string;
};

type AcceptanceErrorResponse = {
    detail?: string;
    message?: string;
    error?: string;
};

const normalizeDestination = (value?: string | null): string => {
    if (!value) return "/te/group";
    const raw = value.trim();
    if (!raw) return "/te/group";

    try {
        const decoded = decodeURIComponent(raw);
        const parsed = new URL(decoded, typeof window !== "undefined" ? window.location.origin : "https://localhost:3000");
        if (parsed.pathname.startsWith("/te/group")) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
        return decoded;
    } catch {
        return raw;
    }
};

export const InvitePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const code = searchParams.get("code");
    const redirectUrl = searchParams.get("url");
    const joinDestination = normalizeDestination(redirectUrl);

    const csrfToken = useCsrfToken();
    const hasAcceptedRef = useRef(false);

    const [status, setStatus] = useState<"loading" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!csrfToken) return;
        if (hasAcceptedRef.current) return;

        if (!code) {
            setStatus("error");
            setErrorMessage("Liên kết mời không hợp lệ — thiếu mã code.");
            return;
        }

        hasAcceptedRef.current = true;

        const accept = async () => {
            const normalizedCode = code.trim();
            const payload = {
                code: normalizedCode,
            };
            let data: AcceptanceResponse | null = null;
            let error: AxiosError | null = null;

            try {
                const response = await axios({
                    method: "POST",
                    url: InviteApiUrl.acceptance,
                    data: payload,
                    withCredentials: true,
                    headers: { "X-CSRF-Token": csrfToken },
                });
                data = (
                    response.data?.metadata ??
                    response.data ??
                    null
                ) as AcceptanceResponse | null;
            } catch (err) {
                error = err as AxiosError;
            }

            if (error) {
                const httpStatus = error?.response?.status;
                const errorBody = error?.response?.data as AcceptanceErrorResponse | undefined;
                const backendMessage =
                    errorBody?.detail ||
                    errorBody?.message ||
                    errorBody?.error ||
                    "";

                if (httpStatus === 301 || httpStatus === 302) { router.replace(joinDestination);
                    return;
                } else if (httpStatus === 404) {
                    setErrorMessage(backendMessage || "Liên kết mời không tồn tại hoặc đã hết hạn.");
                } else if (httpStatus === 400) {
                    setErrorMessage(
                        backendMessage || "Dữ liệu liên kết mời chưa hợp lệ (code). Vui lòng tạo link mới.",
                    );
                } else if (httpStatus === 409) {
                    router.replace(joinDestination);
                    return;
                } else if (httpStatus === 422) {
                    setErrorMessage(backendMessage || "Nhóm đã đầy hoặc liên kết mời không còn hiệu lực.");
                } else {
                    if (!httpStatus) {
                        router.replace(joinDestination);
                        return;
                    }
                    setErrorMessage(backendMessage || "Có lỗi xảy ra, vui lòng thử lại sau.");
                }

                setStatus("error");
                return;
            }
            const destination = normalizeDestination(data?.location) || joinDestination;
            router.replace(destination);
        };

        accept();
    }, [csrfToken, code, joinDestination, router]);

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
                <p className="text-red-400 text-sm">{errorMessage}</p>
                <button
                    onClick={() => router.replace("/")}
                    className="text-xs text-gray-400 underline hover:text-white transition-colors"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-gray-400">
                Đang chuyển hướng đến nhóm của bạn, vui lòng chờ...
            </p>
        </div>
    );
};